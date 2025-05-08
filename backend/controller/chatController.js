const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');
const User = require('../models/User');

// Xử lý truy cập hoặc tạo chat 1-1 giữa hai người dùng
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // Kiểm tra nếu không có userId thì trả lỗi 400
  if (!userId) {
    console.log('UserId param not sent with request');
    return res.sendStatus(400);
  }

  // Tìm chat 1-1 đã tồn tại giữa người dùng hiện tại và userId
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password') // Lấy thông tin users nhưng không lấy mật khẩu
    .populate('latestMessage'); // Lấy thông tin tin nhắn mới nhất

  // Lấy thêm thông tin người gửi của tin nhắn mới nhất
  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'name pic email',
  });

  // Nếu chat đã tồn tại, trả về chat đó
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    // Nếu không tồn tại, tạo chat mới với hai người dùng
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData); // Tạo chat mới trong database
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password'); // Lấy thông tin đầy đủ của chat
      res.status(200).json(fullChat); // Trả về chat vừa tạo
    } catch (error) {
      res.status(400);
      throw new Error(error.message); // Báo lỗi nếu có vấn đề
    }
  }
});

// Lấy danh sách tất cả các cuộc trò chuyện của người dùng hiện tại
const fetchChats = asyncHandler(async (req, res) => {
  try {
    // Kiểm tra nếu không có thông tin người dùng thì báo lỗi
    if (!req.user || !req.user._id) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }
    console.log("Fetching chats for user:", req.user._id);

    // Tìm tất cả chat mà người dùng tham gia, sắp xếp theo thời gian cập nhật
    let results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password') // Lấy thông tin users
      .populate('groupAdmin', '-password') // Lấy thông tin admin nhóm
      .populate('latestMessage') // Lấy tin nhắn mới nhất
      .sort({ updatedAt: -1 }); // Sắp xếp từ mới nhất đến cũ nhất

    console.log("Fetched Chats:", results);

    // Lấy thêm thông tin người gửi của tin nhắn mới nhất
    results = await User.populate(results, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    res.status(200).send(results); // Trả về danh sách chat
  } catch (error) {
    res.status(400);
    throw new Error(error.message); // Báo lỗi nếu có vấn đề
  }
});

// Tạo một nhóm chat mới
const createGroupChat = asyncHandler(async (req, res) => {
  // Kiểm tra nếu thiếu tên nhóm hoặc danh sách người dùng thì báo lỗi
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please fill all the fields' });
  }

  let users = JSON.parse(req.body.users); // Chuyển danh sách người dùng từ JSON

  // Kiểm tra nếu nhóm có ít hơn 2 người thì báo lỗi
  if (users.length < 2) {
    return res.status(400).send('More than 2 users are required to form a group chat');
  }

  users.push(req.user); // Thêm người tạo (người dùng hiện tại) vào nhóm

  try {
    // Tạo nhóm chat mới trong database
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    // Lấy thông tin đầy đủ của nhóm vừa tạo
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat); // Trả về nhóm chat
  } catch (error) {
    res.status(400);
    throw new Error(error.message); // Báo lỗi nếu có vấn đề
  }
});

// Đổi tên nhóm chat
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  // Cập nhật tên nhóm trong database
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  // Kiểm tra nếu không tìm thấy nhóm thì báo lỗi
  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(updatedChat); // Trả về nhóm đã cập nhật
  }
});

// Xóa người dùng khỏi nhóm chat
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Xóa người dùng khỏi danh sách thành viên của nhóm
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  // Kiểm tra nếu không tìm thấy nhóm thì báo lỗi
  if (!removed) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(removed); // Trả về nhóm đã cập nhật
  }
});

// Thêm người dùng vào nhóm chat
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // Thêm người dùng vào danh sách thành viên của nhóm
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  // Kiểm tra nếu không tìm thấy nhóm thì báo lỗi
  if (!added) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(added); // Trả về nhóm đã cập nhật
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
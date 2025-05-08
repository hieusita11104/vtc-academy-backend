const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

// Lấy tất cả tin nhắn của một cuộc trò chuyện
const allMessages = asyncHandler(async (req, res) => {
  try {
    // Tìm tất cả tin nhắn dựa trên ID cuộc trò chuyện
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name pic email') // Lấy thông tin người gửi (tên, ảnh, email)
      .populate('chat'); // Lấy thông tin cuộc trò chuyện
    res.json(messages); // Trả về danh sách tin nhắn
  } catch (error) {
    res.status(400); // Báo lỗi nếu có vấn đề
    throw new Error(error.message);
  }
});

// Gửi một tin nhắn mới
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  // Kiểm tra nếu thiếu nội dung hoặc ID cuộc trò chuyện thì báo lỗi 400
  if (!content || !chatId) {
    console.log('Invalid data passed into request');
    return res.sendStatus(400);
  }

  // Tạo đối tượng tin nhắn mới với người gửi, nội dung và ID cuộc trò chuyện
  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage); // Lưu tin nhắn vào database
    message = await message.populate('sender', 'name pic'); // Lấy thông tin người gửi
    message = await message.populate('chat'); // Lấy thông tin cuộc trò chuyện
    message = await User.populate(message, { // Lấy thông tin người dùng trong cuộc trò chuyện
      path: 'chat.users',
      select: 'name pic email',
    });

    // Cập nhật tin nhắn mới nhất trong cuộc trò chuyện
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message); // Trả về tin nhắn vừa gửi
  } catch (error) {
    res.status(400); // Báo lỗi nếu có vấn đề
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
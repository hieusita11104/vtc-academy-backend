const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../config/generateToken');

// Tìm kiếm người dùng dựa trên từ khóa
const searchUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search // Lấy từ khóa tìm kiếm từ query
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } }, // Tìm theo tên (không phân biệt hoa thường)
          { email: { $regex: req.query.search, $options: 'i' } }, // Tìm theo email (không phân biệt hoa thường)
        ],
      }
    : {};

  // Tìm người dùng khớp với từ khóa, loại trừ người dùng hiện tại, không lấy mật khẩu
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select('-password');
  res.status(200).json(users); // Trả về danh sách người dùng tìm thấy
});

// Đăng ký người dùng mới
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body; // Lấy thông tin từ form

  // Kiểm tra nếu thiếu thông tin thì báo lỗi
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all the fields');
  }

  // Kiểm tra nếu email đã tồn tại
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Tạo người dùng mới trong database
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  // Nếu tạo thành công, trả về thông tin người dùng và token
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id), // Tạo token để đăng nhập
    });
  } else {
    res.status(400);
    throw new Error('Failed to create user'); // Báo lỗi nếu tạo thất bại
  }
});

// Xác thực (đăng nhập) người dùng
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body; // Lấy email và mật khẩu từ form

  // Kiểm tra nếu thiếu email hoặc mật khẩu thì báo lỗi
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Tìm người dùng dựa trên email và kiểm tra mật khẩu
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id), // Tạo token để duy trì phiên đăng nhập
    });
  } else {
    res.status(401); // Báo lỗi nếu email hoặc mật khẩu sai
    throw new Error('Invalid email or password');
  }
});

module.exports = { searchUsers, registerUser, authUser };
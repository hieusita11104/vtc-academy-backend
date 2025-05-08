const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const User = require('./models/User');
const Chat = require('./models/Chat');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const cors = require('cors');

// Tải biến môi trường từ file .env
dotenv.config();
// Kết nối với MongoDB
connectDB();
// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình CORS để cho phép giao tiếp với frontend (localhost:5173)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(express.json()); // Cho phép server nhận dữ liệu JSON từ client

// Hàm chèn dữ liệu mẫu để kiểm tra
const insertSampleData = asyncHandler(async () => {
  // Kiểm tra nếu đã có dữ liệu thì bỏ qua
  const existingUsers = await User.countDocuments();
  const existingChats = await Chat.countDocuments();
  if (existingUsers > 0 || existingChats > 0) {
    console.log('Dữ liệu mẫu đã tồn tại, bỏ qua.');
    return;
  }

  // Dữ liệu mẫu: một cuộc chat 1-1 giữa hai người dùng
  const chats = [
    {
      isGroupChat: false,
      users: [
        { name: 'Test User', email: 'test@example.com' },
        { name: 'Piyush', email: 'piyush@example.com' },
      ],
      _id: '617a077e18c25468bc7c4dd5',
      chatName: 'Test User',
    },
  ];

  // Tạo danh sách người dùng từ dữ liệu mẫu
  const userMap = new Map();
  for (const chat of chats) {
    for (const user of chat.users) {
      const key = `${user.name}|${user.email}`;
      if (!userMap.has(key)) {
        userMap.set(key, user);
      }
    }
  }

  // Mã hóa mật khẩu mẫu
  const plainPassword = 'test123';
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Chuẩn bị dữ liệu người dùng để lưu vào database
  const usersToCreate = Array.from(userMap.values()).map((user) => ({
    name: user.name,
    email: user.email,
    password: hashedPassword,
    pic: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  }));

  const createdUsers = await User.insertMany(usersToCreate); // Lưu người dùng vào database

  // Ánh xạ email người dùng với ID để dùng cho chat
  const userIdMap = new Map();
  createdUsers.forEach((user) => {
    userIdMap.set(user.email, user._id);
  });

  // Chuẩn bị dữ liệu chat để lưu vào database
  const chatsToCreate = chats.map((chat) => ({
    _id: chat._id,
    chatName: chat.chatName,
    isGroupChat: chat.isGroupChat,
    users: chat.users.map((user) => userIdMap.get(user.email)),
    groupAdmin: chat.groupAdmin ? userIdMap.get(chat.groupAdmin.email) : null,
  }));

  await Chat.insertMany(chatsToCreate); // Lưu chat vào database

  console.log('Dữ liệu mẫu đã được chèn thành công!');
});

// Chạy hàm chèn dữ liệu mẫu
insertSampleData();

// Định nghĩa các tuyến đường API
app.use('/api/user', userRoutes); // Xử lý đăng ký, đăng nhập, tìm kiếm người dùng
app.use('/api/chat', chatRoutes); // Xử lý tạo và quản lý cuộc trò chuyện
app.use('/api/message', messageRoutes); // Xử lý gửi và lấy tin nhắn

// Xử lý khi chạy ở môi trường production hoặc development
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
  // Phục vụ file tĩnh từ thư mục build của frontend
  app.use(express.static(path.join(__dirname1, '/frontend/build')));
  // Chuyển hướng tất cả yêu cầu đến file index.html của frontend
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'))
  );
} else {
  // Hiển thị thông báo API đang chạy khi ở môi trường development
  app.get('/', (req, res) => {
    res.send('API đang chạy...');
  });
}

// Middleware xử lý lỗi 404 và lỗi chung
app.use(notFound);
app.use(errorHandler);

// Khởi động server trên cổng chỉ định (mặc định 5000)
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`Server đang chạy trên PORT ${PORT}...`.yellow.bold)
);

// Thiết lập Socket.io để hỗ trợ nhắn tin thời gian thực
const io = require('socket.io')(server, {
  pingTimeout: 60000, // Đặt thời gian chờ trước khi ngắt kết nối
  cors: {
    origin: 'http://localhost:5173', // Cho phép kết nối từ frontend
  },
});

// Xử lý các sự kiện Socket.io
io.on('connection', (socket) => {
  console.log('Kết nối với socket.io'); // Thông báo khi có người dùng kết nối
  let userData;

  // Khi người dùng thiết lập kết nối
  socket.on('setup', (data) => {
    userData = data;
    socket.join(userData._id); // Thêm người dùng vào phòng riêng
    socket.emit('connected'); // Thông báo đã kết nối thành công
  });

  // Khi người dùng tham gia phòng chat
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log('Người dùng tham gia phòng: ' + room);
  });

  // Khi người dùng bắt đầu gõ tin nhắn
  socket.on('typing', (room) => {
    socket.in(room).emit('typing'); // Thông báo cho các thành viên khác trong phòng
  });

  // Khi người dùng ngừng gõ tin nhắn
  socket.on('stop typing', (room) => {
    socket.in(room).emit('stop typing'); // Thông báo ngừng gõ
  });

  // Khi nhận tin nhắn mới
  socket.on('new message', (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log('chat.users không được định nghĩa');

    // Gửi tin nhắn đến tất cả thành viên trong nhóm, trừ người gửi
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  // Khi người dùng ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Người dùng ngắt kết nối');
    if (userData) {
      socket.leave(userData._id); // Rời phòng khi ngắt kết nối
    }
  });
});
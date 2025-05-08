// Hàm lấy tên người gửi (dành cho giao diện hiển thị tên người dùng)
const getSender = (loggedUser, users) => {
  if (!users || users.length === 0 || !loggedUser) return "Unknown User";
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

// Hàm lấy thông tin đầy đủ của người gửi (dành cho các logic khác)
const getSenderFull = (loggedUser, users) => {
  if (!users || users.length === 0 || !loggedUser) return null;
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};

// Kiểm tra xem tin nhắn hiện tại có cùng người gửi với tin nhắn tiếp theo không
const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

// Kiểm tra xem tin nhắn hiện tại có phải là tin nhắn cuối cùng không
const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

// Tính toán khoảng cách margin giữa các tin nhắn cùng người gửi
const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33; // Khoảng cách giữa các tin nhắn cùng người gửi
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0; // Không cần margin
  else return "auto"; // Tự động căn chỉnh
};

// Kiểm tra xem tin nhắn hiện tại có cùng người gửi với tin nhắn trước đó không
const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

// Xuất các hàm để sử dụng trong các file khác
export { getSender, getSenderFull, isSameSender, isLastMessage, isSameSenderMargin, isSameUser };
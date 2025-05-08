import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import ChatLoading from "./ChatLoading";
import SearchUser from "./SearchUser";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket;

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats, unreadMessages, setUnreadMessages } = ChatState();
  const [loading, setLoading] = useState(false);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      if (Array.isArray(data)) {
        setChats(data);
      } else {
        setChats([]);
      }
      setLoading(false);
    } catch (error) {
      alert("Failed to load chats");
      setChats([]);
      setLoading(false);
    }
  };

  const handleSelectUser = async (userId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      // Kiểm tra xem chat đã tồn tại hay chưa
      const existingChat = chats.find(
        (chat) =>
          !chat.isGroupChat &&
          chat.users.some((user) => user._id === userId)
      );

      if (existingChat) {
        // Nếu chat đã tồn tại, chỉ cần đặt nó làm chat được chọn và đưa nó lên đầu danh sách
        setSelectedChat(existingChat);
        setChats([existingChat, ...chats.filter((chat) => chat._id !== existingChat._id)]);
      } else {
        // Nếu chat chưa tồn tại, tạo một chat mới
        const { data } = await axios.post("/api/chat", { userId }, config);
        setSelectedChat(data);
        setChats([data, ...chats]);
      }
    } catch (error) {
      alert("Failed to start chat");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
  
    socket.on("message received", (newMessageReceived) => {
      const chatId = newMessageReceived.chat._id;
  
      // Đưa chat lên đầu khi nhận tin nhắn
      setChats((prevChats) => {
        const existingChat = prevChats.find((chat) => chat._id === chatId);
  
        if (existingChat) {
          // Đưa chat có tin nhắn mới lên đầu danh sách
          return [
            { ...existingChat, latestMessage: newMessageReceived },
            ...prevChats.filter((chat) => chat._id !== chatId),
          ];
        } else {
          // Nếu chat chưa tồn tại, thêm nó vào danh sách
          return [...prevChats];
        }
      });
  
      // Cập nhật tin nhắn chưa đọc nếu không phải chat đang mở
      if (!selectedChat || selectedChat._id !== chatId) {
        setUnreadMessages((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1,
        }));
      }
    });
  
    return () => {
      socket.off("message received");
    };
  }, [selectedChat]);
  
  const handleSendMessage = async (messageContent) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
  
      const { data } = await axios.post(
        "/api/message",
        {
          content: messageContent,
          chatId: selectedChat._id,
        },
        config
      );
  
      // Đưa chat lên đầu khi gửi tin nhắn
      setChats((prevChats) => {
        const existingChat = prevChats.find((chat) => chat._id === selectedChat._id);
  
        if (existingChat) {
          return [
            { ...existingChat, latestMessage: data },
            ...prevChats.filter((chat) => chat._id !== selectedChat._id),
          ];
        } else {
          return [...prevChats];
        }
      });
  
      // Cập nhật tin nhắn trong giao diện hiện tại
      setSelectedChat((prevChat) => ({
        ...prevChat,
        latestMessage: data,
      }));
    } catch (error) {
      alert("Failed to send message");
    }
  };

  return (
    <div
      className={`${
        selectedChat ? "hidden md:flex" : "flex"
      } flex-col p-4 bg-white w-full md:w-1/3 border rounded-xl shadow-lg transition-all duration-300`}
    >
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-800">My Chats</h2>
        <GroupChatModal>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            New Group Chat +
          </button>
        </GroupChatModal>
      </div>
      <SearchUser onSelectUser={handleSelectUser} />
      <div className="flex flex-col p-4 bg-white w-full h-full rounded-lg overflow-y-auto shadow-sm">
        {loading ? (
          <ChatLoading />
        ) : chats?.length > 0 ? (
          chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 mb-2 rounded-lg cursor-pointer transition-colors relative shadow-sm ${
                selectedChat === chat ? "bg-blue-600 text-white" : "bg-white text-gray-800 hover:bg-blue-500"
              }`}
            >
              <p className="text-lg font-medium">
                {!chat.isGroupChat && chat.users && loggedUser
                  ? getSender(loggedUser, chat.users)
                  : chat.chatName || "Unknown Chat"}
              </p>
              {unreadMessages[chat._id] > 0 && (
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full absolute top-1/2 right-2 transform -translate-y-1/2">
                  {unreadMessages[chat._id]}
                </span>
              )}
              {chat.latestMessage && (
                <p className="text-sm text-gray-500">
                  {chat.latestMessage.content.length > 20
                    ? `${chat.latestMessage.content.substring(0, 20)}...`
                    : chat.latestMessage.content}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No chats available</p>
        )}
      </div>
    </div>
  );
};

export default MyChats;
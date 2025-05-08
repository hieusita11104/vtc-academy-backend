import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, unreadMessages, setUnreadMessages } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat || selectedChat.isGroupChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      // Reset unread messages when opening chat
      if (unreadMessages[selectedChat._id]) {
        setUnreadMessages((prev) => {
          const newUnread = { ...prev };
          delete newUnread[selectedChat._id];
          return newUnread;
        });
      }
    } catch (error) {
      alert("Failed to load messages");
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const messageToSend = newMessage; // Lưu tin nhắn trước khi reset
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: messageToSend,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]); // Cập nhật danh sách tin nhắn
      } catch (error) {
        alert("Failed to send message");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
  
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        // Nếu tin nhắn thuộc chat khác, cập nhật tin nhắn chưa đọc
        setUnreadMessages((prev) => ({
          ...prev,
          [newMessageReceived.chat._id]: (prev[newMessageReceived.chat._id] || 0) + 1,
        }));
      } else {
        // Nếu tin nhắn thuộc chat hiện tại, thêm tin nhắn vào danh sách
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });
  
    return () => {
      socket.off("message received");
    };
  }, [selectedChat]);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  const otherUser = selectedChat && !selectedChat.isGroupChat
    ? getSender(user, selectedChat.users)
    : null;

  return (
    <div className="flex flex-col p-4 bg-white w-full h-full border rounded-xl shadow-lg">
      {selectedChat && !selectedChat.isGroupChat ? (
        <>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {otherUser}
            </h2>
            {unreadMessages[selectedChat._id] > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadMessages[selectedChat._id]}
              </span>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {loading ? (
              <p className="text-center text-lg text-gray-500 animate-pulse">Loading...</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === user._id ? "justify-end" : "justify-start"
                  } mb-3`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-xl ${
                      message.sender._id === user._id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    } shadow-sm hover:shadow-md transition-shadow`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-white">
            <input
              type="text"
              placeholder="Enter a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={sendMessage}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-xl text-gray-400 font-medium">Select a private chat to start messaging</p>
        </div>
      )}
    </div>
  );
};

export default SingleChat;
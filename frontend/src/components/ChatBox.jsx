import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import { ChatState } from "../Context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import io from "socket.io-client";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load messages");
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("Failed to send message");
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Handle notification logic if needed
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div
      className={`flex flex-col p-4 bg-white w-full md:w-2/3 border rounded-xl shadow-lg transition-all duration-300 ${
        selectedChat ? "flex" : "hidden md:flex"
      }`}
    >
      {selectedChat ? (
        <>
          <div className="flex justify-between items-center w-full px-4 pb-4 border-b">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
              </button>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {selectedChat.isGroupChat
                  ? selectedChat.chatName
                  : getSender(user, selectedChat.users)}
              </h2>
            </div>
            {selectedChat.isGroupChat && (
              <UpdateGroupChatModal
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            )}
          </div>
          <div className="flex flex-col p-4 bg-white w-full h-full rounded-lg overflow-y-auto shadow-sm">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-lg text-gray-500 animate-pulse">Loading...</span>
              </div>
            ) : (
              <ScrollableChat messages={messages} />
            )}
            <input
              type="text"
              placeholder="Enter a message..."
              className="mt-4 w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              onChange={typingHandler}
              onKeyDown={sendMessage}
              value={newMessage}
            />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full">
          <p className="text-xl md:text-2xl text-gray-400 font-medium">
            Select a chat to start messaging
          </p>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
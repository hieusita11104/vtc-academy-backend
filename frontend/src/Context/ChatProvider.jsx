import React, { createContext, useContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children, user, setUser }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState({});

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        unreadMessages,
        setUnreadMessages,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};
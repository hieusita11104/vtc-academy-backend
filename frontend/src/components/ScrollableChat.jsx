import React from "react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div className="messages flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <div className="relative group">
                <img
                  className="mt-2 mr-1 h-6 w-6 rounded-full object-cover"
                  src={m.sender.pic}
                  alt={m.sender.name}
                />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-blue-600 text-white text-xs rounded py-1 px-2">
                  {m.sender.name}
                </span>
              </div>
            )}
            <span
              className={`${
                m.sender._id === user._id ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-800"
              } rounded-2xl px-4 py-1 max-w-[75%] shadow-sm`}
              style={{
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </div>
  );
};

export default ScrollableChat;
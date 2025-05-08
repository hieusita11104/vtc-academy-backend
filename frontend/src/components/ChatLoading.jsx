import React from "react";

const ChatLoading = () => {
  return (
    <div className="flex justify-center items-center h-full bg-white p-4 rounded-lg shadow-sm">
      <p className="text-lg text-blue-600 animate-pulse">Loading...</p>
    </div>
  );
};

export default ChatLoading;
import React from "react";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ user: selectedUser, handleFunction }) => {
  const { user } = ChatState();

  return (
    <div
      className="flex items-center gap-3 p-3 bg-gray-100 hover:bg-blue-500 hover:text-white rounded-lg mb-2 cursor-pointer w-full shadow-sm transition duration-200"
      onClick={handleFunction}
    >
      <img
        className="h-8 w-8 rounded-full object-cover"
        src={selectedUser.pic}
        alt={selectedUser.name}
      />
      <div>
        <p className="text-base font-medium">{selectedUser.name}</p>
        <p className="text-sm">
          <b>Email: </b>
          {selectedUser.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
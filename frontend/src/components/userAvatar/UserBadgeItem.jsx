import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1 bg-blue-600 text-white rounded-lg m-1 cursor-pointer hover:bg-blue-700 transition duration-200"
      onClick={handleFunction}
    >
      <span className="text-sm">
        {user.name}
        {admin === user._id && <span> (Admin)</span>}
      </span>
      <XMarkIcon className="h-4 w-4" />
    </div>
  );
};

export default UserBadgeItem;
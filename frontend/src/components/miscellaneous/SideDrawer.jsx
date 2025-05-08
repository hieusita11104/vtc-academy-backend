import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const SideDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = ChatState();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="p-2 bg-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
      >
        {isOpen ? "Đóng" : "Mở"} Drawer
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-white rounded-lg shadow-lg transition-all duration-300">
          <p className="text-lg font-medium text-gray-800">Chào mừng, {user?.name}</p>
          <button
            onClick={logoutHandler}
            className="mt-3 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default SideDrawer;
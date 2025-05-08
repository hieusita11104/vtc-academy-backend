import React from "react";
import { EyeIcon } from "@heroicons/react/24/solid";

const ProfileModal = ({ user, children }) => {
  const openModal = () => document.getElementById("profileModal").showModal();
  const closeModal = () => document.getElementById("profileModal").close();

  return (
    <div>
      {children ? (
        <span onClick={openModal}>{children}</span>
      ) : (
        <button onClick={openModal} className="p-2 rounded-full hover:bg-gray-200">
          <EyeIcon className="h-6 w-6 text-gray-600" />
        </button>
      )}
      <dialog
        id="profileModal"
        className="bg-black bg-opacity-50 border-none rounded-lg max-w-md w-[90%] mx-auto"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-blue-700 text-center mb-4">{user.name}</h3>
          <div className="py-4 flex flex-col items-center space-y-4">
            <img
              className="h-32 w-32 rounded-full object-cover"
              src={user.pic}
              alt={user.name}
            />
            <p className="text-lg font-medium text-gray-800">
              Email: {user.email}
            </p>
          </div>
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={closeModal}
            >
              Đóng
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfileModal;
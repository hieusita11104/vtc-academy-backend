import React, { useState } from "react";
import axios from "axios";
import { EyeIcon } from "@heroicons/react/24/solid";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${query}`, config);
      setLoading(false);
      setSearchResult(data || []);
    } catch (error) {
      alert("Error Occured! Failed to Load the Search Results");
      setLoading(false);
      setSearchResult([]);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) {
      alert("Please enter a new chat name");
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
      alert("Group chat renamed successfully!");
    } catch (error) {
      alert("Failed to rename the chat!");
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      alert("User already in group!");
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add someone!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      alert("User added to group!");
    } catch (error) {
      alert("Failed to add user!");
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      alert("Only admins can remove someone!");
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
      alert(user1._id === user._id ? "You left the group!" : "User removed from group!");
    } catch (error) {
      alert("Failed to remove user!");
      setLoading(false);
    }
  };

  const openModal = () => document.getElementById("updateGroupChatModal").showModal();
  const closeModal = () => document.getElementById("updateGroupChatModal").close();

  return (
    <div>
      <button onClick={openModal} className="p-2 rounded-full hover:bg-gray-200">
        <EyeIcon className="h-6 w-6 text-gray-600" />
      </button>
      <dialog
        id="updateGroupChatModal"
        className="bg-black bg-opacity-50 border-none rounded-lg max-w-md w-[90%] mx-auto"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-blue-700 text-center mb-4">
            {selectedChat.chatName}
          </h3>
          <div className="flex flex-col items-center space-y-3">
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  admin={selectedChat.groupAdmin}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </div>
            <div className="flex w-full gap-2">
              <input
                type="text"
                placeholder="Tên nhóm chat"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg transition duration-200 ${
                  renameLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
                onClick={handleRename}
                disabled={renameLoading}
              >
                {renameLoading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
            <input
              type="text"
              placeholder="Thêm người dùng vào nhóm (VD: Piyush, Lan)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
            {loading ? (
              <div className="text-gray-500 text-center text-sm">Đang tải...</div>
            ) : (
              Array.isArray(searchResult) &&
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              onClick={() => handleRemove(user)}
            >
              Rời nhóm
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
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

export default UpdateGroupChatModal;
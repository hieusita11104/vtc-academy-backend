import React, { useState } from "react";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { ChatState } from "../../Context/ChatProvider";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      alert("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

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
      alert("Error Occurred! Failed to Load the Search Results");
      setLoading(false);
      setSearchResult([]);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers.length) {
      alert("Please fill all the fields");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setGroupChatName("");
      setSelectedUsers([]);
      alert("New Group Chat Created!");
    } catch (error) {
      alert("Failed to Create the Chat!");
    }
  };

  return (
    <div>
      <span onClick={() => document.getElementById("groupChatModal").showModal()}>
        {children}
      </span>
      <dialog
        id="groupChatModal"
        className="bg-black bg-opacity-50 border-none rounded-lg max-w-md w-[90%] mx-auto"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold text-blue-700 mb-4 text-center">Tạo nhóm chat</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Tên nhóm chat"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Thêm người dùng (VD: John, Piyush, Jane)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </div>
            {loading ? (
              <div className="text-gray-500 text-center text-sm">Đang tải...</div>
            ) : (
              Array.isArray(searchResult) &&
              searchResult.slice(0, 4).map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            )}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={handleSubmit}
            >
              Tạo
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200"
              onClick={() => document.getElementById("groupChatModal").close()}
            >
              Đóng
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default GroupChatModal;
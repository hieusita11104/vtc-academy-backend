import React, { useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";

const SearchUser = ({ onSelectUser }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = ChatState();

  const handleSearch = async () => {
    if (!search) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user/search?search=${search}`, config);
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      alert("Failed to search users");
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search User"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go
        </button>
      </div>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : searchResults.length > 0 ? (
        <div className="space-y-2">
          {searchResults.map((user) => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user._id)}
              className="flex items-center p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-blue-500 hover:text-white shadow-sm"
            >
              <img
                src={user.pic}
                alt={user.name}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No users found</p>
      )}
    </div>
  );
};

export default SearchUser;
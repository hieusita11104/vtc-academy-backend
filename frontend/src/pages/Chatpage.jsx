import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import Chatbox from "../components/ChatBox";
import SingleChat from "../components/SingleChat";
import ProfileModal from "../components/miscellaneous/ProfileModal";

const Chatpage = () => {
  const { user, selectedChat } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col" style={{ background: "linear-gradient(to bottom, #f4f7fa, #e0e7ff)" }}>
      {user && (
        <div className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
          <SideDrawer />
          <ProfileModal user={user}>
            <button className="text-lg font-semibold text-blue-600 hover:underline">
              {user.name}
            </button>
          </ProfileModal>
        </div>
      )}
      <div className="flex flex-1 p-4 gap-4">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <div className="flex-1">
            {selectedChat?.isGroupChat ? (
              <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            ) : (
              <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatpage;
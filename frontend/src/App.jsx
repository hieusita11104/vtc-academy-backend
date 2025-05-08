import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";
import { ChatProvider } from "./Context/ChatProvider";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) setUser(userInfo);
  }, []);

  return (
    <ChatProvider user={user} setUser={setUser}>
      <div className="App" style={{ background: "linear-gradient(to bottom, #f4f7fa, #e0e7ff)", minHeight: "100vh" }}>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/chats" element={<Chatpage />} />
          </Routes>
        </Router>
      </div>
    </ChatProvider>
  );
}

export default App;
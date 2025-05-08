import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/SigNup";

function Homepage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center max-w-xl mx-auto" style={{ background: "linear-gradient(to bottom, #f4f7fa, #e0e7ff)" }}>
      <div className="flex justify-center p-3 bg-white w-full my-10 border rounded-lg shadow">
        <h1 className="text-4xl font-semibold font-sans">Talk-A-Tive</h1>
      </div>
      <div className="bg-white w-full p-4 border rounded-lg shadow">
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-lg w-1/2 ${
              activeTab === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-lg w-1/2 ${
              activeTab === "signup"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
        </div>
        <div>
          {activeTab === "login" && <Login />}
          {activeTab === "signup" && <Signup />}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
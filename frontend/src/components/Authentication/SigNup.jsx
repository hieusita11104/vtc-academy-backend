import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const { setUser } = ChatState();

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      alert("Please Fill all the Fields");
      setPicLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords Do Not Match");
      setPicLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        {
          name,
          email,
          password,
          pic: pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        },
        config
      );
      alert("Registration Successful");
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (!pics) {
      alert("Please Select an Image!");
      setPicLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          alert("Error Uploading Image!");
          setPicLoading(false);
        });
    } else {
      alert("Please Select an Image!");
      setPicLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">Đăng ký</h2>
      <div>
        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
          Họ và tên
        </label>
        <input
          id="first-name"
          type="text"
          placeholder="Nhập họ và tên của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="password"
            type={show ? "text" : "password"}
            placeholder="Nhập mật khẩu của bạn"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          <button
            onClick={handleClick}
            className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {show ? "Ẩn" : "Hiện"}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
          Xác nhận mật khẩu
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type={show ? "text" : "password"}
            placeholder="Xác nhận mật khẩu của bạn"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
          <button
            onClick={handleClick}
            className="absolute inset-y-0 right-0 px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {show ? "Ẩn" : "Hiện"}
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="pic" className="block text-sm font-medium text-gray-700">
          Tải lên ảnh đại diện
        </label>
        <input
          id="pic"
          type="file"
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        onClick={submitHandler}
        disabled={picLoading}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
      >
        {picLoading ? "Đang xử lý..." : "Đăng ký"}
      </button>
    </div>
  );
};

export default Signup;
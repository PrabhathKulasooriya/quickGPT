import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      navigate("/");
    }, 5000);
    return () => clearTimeout(timeOut);
  },[]);

  return (
    <div
      className="bg-gradient-to-b from-[#531B81] to-[#29184B] flex 
    items-center justify-center h-screen w-screen"
    >
      <div className="w-10 h-10 border-4 border-white border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

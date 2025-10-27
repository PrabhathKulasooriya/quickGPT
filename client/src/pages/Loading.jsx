import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Loading = () => {
  const navigate = useNavigate();
  const {fetchUser} = useAppContext();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      fetchUser();
      navigate("/");
    }, 3000);
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

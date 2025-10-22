import {useEffect, useState, useRef} from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets';
import Message from './Message';

const ChatBox = () => {

  const containerRef = useRef(null);
  
  const {selectedChat,theme} = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e)=>{
      e.preventDefault();
  }

  useEffect(()=>{
    if(selectedChat){
      setMessages(selectedChat.messages);
    }
  },[selectedChat]);

  useEffect(()=>{
    if(containerRef.current){
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",})
    }
  },[messages]);

  return (
    <div className=" flex flex-1 flex-col justify-start m-5 md:m-10 xl:mx-32 max-md:mt-14 2xl:pr-40">

      {/* Chat Messages */}
      <div ref={containerRef} className="flex flex-1 flex-col mb-5 p-4 overflow-y-auto items-center  h-full w-full ">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center gap-2 ">
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
              alt=""
              className="w-full max-w-56 sm:max-w-68"
            />
            <p className="mt-5 text-4xl sm:text-6xl text-center text-gray-400">
              Ask me anything.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* Three dots loading animation */}
        {loading && (
          <div className="loader flex items-start gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-wite animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-wite animate-bounce"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-wite animate-bounce"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto dark:text-white'>
          <p className='text-xs'>Publish generated images to community</p>
          <input type="checkbox" checked={isPublished} onChange={(e)=>setIsPublished(e.target.checked)} className="cursor-pointer" />
        </label>
      )}

      {/* Prompt input box */}
      <form onSubmit={onSubmit} className='bg-primary/20 dark:bg-[#583c79]/30 border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 
      mx-auto flex gap-4 items-center'>
        <select onChange={(e)=>setMode(e.target.value)} value={mode} name="" id="" className='text-sm pl-3 pr-2 outline-none'>
          <option value="text" className='dark:bg-purple-900'>Text</option>
          <option value="image" className='dark:bg-purple-900'>Image</option>
        </select>
        <input type="text" placeholder='Type your prompt here...' className='flex-1 w-full text-sm outline-none'
         required value={prompt} onChange={(e)=>setPrompt(e.target.value)}/>

        <button disabled={loading}>
          <img src={loading? assets.stop_icon : assets.send_icon} alt="" className='w-8 cursor-pointer'/>
        </button>
         
      </form>
    </div>
  );
}

export default ChatBox

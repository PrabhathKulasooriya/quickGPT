import { useEffect } from 'react';
import {assets} from '../assets/assets'
import moment from "moment"; 
import logo from '../assets/logo.svg'
import Markdown from 'react-markdown'
import Prism from 'prismjs'

const Message = ({message}) => {

  useEffect(() => {
    Prism.highlightAll();
  }, [message.content]);

  return (
    <div className='flex flex-col flex-1  w-full'>
      {message.role === "user" ? (
        <div className="flex items-start justify-end my-4 gap-2 ">
          <div className="flex flex-col gap-1 px-4 py-2 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-lg max-w-lg">
            <p className='text-sm dark:text-white'>{message.content}</p>
            <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
          </div>
          <img src={assets.user_icon} alt="" className='w-10 h-10 rounded-full flex-shrink-0'/>
        </div>
      ) : (
        <div className="">
        <div className="inline-flex flex-col gap-2 items-start gap-1 max-w-max px-4 py-2 bg-slate-50 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-md ml-12">
            {message.isImage ? (
                <img src={message.content} alt="" className='w-full rounded-md max-w-md mt-2'/>
              ) : (
                <div className="text-sm dark:text-primary reset-tw">
                 <Markdown>{message.content}</Markdown>
                </div>
              )}
          <span className='text-xs text-gray-400 dark:text-[#B1A6C0]'>{moment(message.timestamp).fromNow()}</span>
        </div>
        <img src={logo} alt="" className='mt-2 roundend-md w-10 h-10 rounded-full'/>
        </div>
      ) }
    </div>
  )
}

export default Message
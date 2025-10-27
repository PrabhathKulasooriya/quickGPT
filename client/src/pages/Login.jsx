import React,{useState} from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import toast from 'react-hot-toast';

const Login = () => {

  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {axios, setToken} = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const  url = state === 'login' ? "/api/user/login" : '/api/user/register';

    try{
      const {data} = await axios.post(url, {name, email, password});
      if(data.success){
        setToken(data.token);
        localStorage.setItem("token", data.token);
      }else{
        toast.error(data.message);  
      }
    }catch(error){
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-purple-300/90 rounded-2xl px-8 bg-slate-50 dark:bg-[#583c79]/30 py-12">
                <h1 className="text-purple-700 text-3xl mt-10 font-medium dark:text-white">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 dark:bg-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-icon lucide-user-round"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0 text-gray-900"value={name} onChange={(e) => setName(e.target.value)}  required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 dark:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0 text-gray-900" value={email} onChange={(e) => setEmail(e.target.value)}  required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2 dark:bg-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock-icon lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0 text-gray-900" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="mt-4 text-left text-indigo-500">
                    <button className="text-sm" type="reset">Forget password?</button>
                </div>
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] hover:opacity-90 transition-opacity">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-indigo-500 hover:underline">click here</a></p>
            </form>
           
  )
}

export default Login

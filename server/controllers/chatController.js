import Chat from "../models/Chat.js";


//Api controller for crating a new chat
export const createChat = async (req, res) => {
    try{
        const userId = req.user._id;
        const chatData = {
            userId,
            messages: [],
            name: "New Chat",
            userName: req.user.name
        }

        await Chat.create(chatData);

        res.status(200).json({
            success: true,
            message: "Chat created successfully"
        });


    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Api controller for getting old chat
export const getChats = async (req, res)=>{
    try{
        const userId = req.user._id;
        const chats = await Chat.find({userId}).sort({updatedAt: -1});
        res.status(200).json({
            success: true,
            chats
        })

    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Api controller for deleting chat
export const deleteChat = async (req, res)=>{
    try{
        const userId = req.user._id;
        const {chatId} = req.body;

        await Chat.deleteOne({_id:chatId,userId});
        res.status(200).json({
            success: true,
            message: "Chat deleted successfully"
        })
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
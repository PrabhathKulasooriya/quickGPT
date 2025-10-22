import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Chat from '../models/Chat.js';


//Generate JWT 

const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:'30d'});
}

//Api for user registration
export const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try{
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({success:false,message: "User already exists"});
        }

        const user = await User.create({
            name,
            email,
            password
        });

        const token = generateToken(user._id);
        res.status(200).json({
            success: true,
            token,
        })
   
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }

}

//Api for user login 
export const loginUser = async (req, res)=>{
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email})
        if(user){
            const isMatched = await bcrypt.compare(password,user.password);
            if(isMatched){
                const token = generateToken(user._id);
                return res.status(200).json({
                    success: true,
                    token,
                })
            }else{
                return res.status(400).json({
                    success: false,
                    message: "Incorrect Password"
                })
            }
        }
        return res.status(400).json({
          success: false,
          message: "Incorrect Username or Password",
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
} 

//Api to get user data
export const getUser = async (req, res)=>{
    try{
        const user = req.user;
        return res.status(200).json({
            success: true,
            user
        })
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Api to get published images
export const getPublishedImages = async (req, res)=>{
    try{
        const publishedImageMessages = await Chat.aggregate([
            {$unwind:'$messages'},
            {
                $match:{
                "message.isImage": true,
                "message.isPublished":true
                }
            },
            {
                $project:{
                    _id:0,
                    imageUrl:"$message.content",
                    userName : "$userName"
                }
            }
        ])

        res.status(200).json({
            success:true,
            images:publishedImageMessages.reverse()
        })

    }catch(error){
        res.status(400).json({
            success:false,
            message: error.message
        })
    }
}
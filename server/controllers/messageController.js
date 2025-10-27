import imagekit from "../configs/imagekit.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import openai from "../configs/openai.js";
import axios from "axios";


//Text based AI message controller
export const textMessageController = async (req, res) => {
    try{
        const userId = req.user._id;
        const {chatId,prompt} = req.body;

        //check Credits
        if(req.user.credits<1){
            return res.status(400).json({
                success: false,
                message: "Not enough credits to generate response"
            })
        }

        const chat = await Chat.findOne({userId, _id: chatId});
        chat.messages.push({role:"user",content:prompt,timestamp:Date.now(), isImage:false});
        
        const {choices} = await openai.chat.completions.create({
          model: "gemini-2.0-flash",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const reply = {...choices[0].message,timestamp:Date.now(), isImage:false};

        res.status(200).json({
          success: true,
          reply,
        });
        
        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id:userId},{$inc:{credits:-1}});

        
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

//Image Generation message controller
// export const imageMessageController = async (req, res) => {
//     try{
//         const userId = req.user._id;
        
//         //check Credits
//         if(req.user.credits<2){
//             return res.status(400).json({
//                 success: false,
//                 message: "Not enough credits for image generation"
//             })
//         }

//         const {prompt, chatId, isPublished} = req.body;
//         const chat = await Chat.findOne({userId, _id: chatId});

//         chat.messages.push({role:"user",content:prompt,timestamp:Date.now(), isImage:false});

//         //Encode the prompt
//         const encodedPrompt = encodeURIComponent(prompt);

//         //Construct ImageKit AI generation URL
//         const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png`;

        

//         //Trigger Generation by fetching from ImageKit
//         const aiImageResponse = await axios.get(generatedImageUrl,{responseType: 'arraybuffer'});

//         //convert to base64
//         const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

//         //upload to imagekit media library
//         const uploadResponse = await imagekit.upload({
//             file: base64Image,
//             fileName: `${Date.now()}.png`,
//             folder: "quickgpt"
//         });
        
//         const reply = {role:"assistant",content:uploadResponse.url,timestamp:Date.now(), isImage:true, isPublished};

//         res.status(200).json({
//           success: true,
//           reply,
//         });

//         chat.messages.push(reply);
//         chat.save();
//         await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
   

//     }catch(error){
//         res.status(400).json({
//             success: false,
//             message: error.message
//         })
//     }
// }

export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.status(400).json({
        success: false,
        message: "Not enough credits for image generation",
      });
    }

    const { prompt, chatId, isPublished } = req.body;
    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Generate with Pollinations.ai
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    // Download the image
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });
    const base64Image = `data:image/png;base64,${Buffer.from(
      imageResponse.data,
      "binary"
    ).toString("base64")}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "quickgpt",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamp: Date.now(),
      isImage: true,
      isPublished,
    };

    res.status(200).json({
      success: true,
      reply,
    });

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    console.error("Full error:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

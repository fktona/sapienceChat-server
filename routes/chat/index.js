import express from "express";
//import  {uploadMiddleware}  from "../middlewares/multer.js";
import { upload } from "../../middlewares/multer.js";
// import { chat } from "../../controllers/chat.js";
import { uploadFile } from "../../controller/upload/uploadFile.js";
import getChatbotInfo from "../../controller/userChatbot/getChatbotInfo.js";
import startChat from "../../controller/userChatbot/startChat.js";

const router = express.Router()

router.post('/upload/:userId',upload ,   uploadFile)
router.get('/chatbot/:userId', getChatbotInfo)
router.post('/chatbot/:slug', startChat)
// router.get('/chat/:file', chat)

export default router
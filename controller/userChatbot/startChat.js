import { liveServer } from "../../connections/server.js";
import { startLiveServer } from "../../connections/index.js";
import { v4 as  uuidv4 } from 'uuid';

const startChat = async (req, res) => {
    const { slug } = req.params;
    console.log('slug'); 

    if (!slug) {
        return res.status(400).json({ message: "file slug is required" });
    }

    const customerId = uuidv4();

    try {
    //   await  liveServer(slug);
        await startLiveServer(customerId);
        res.status(200).json({ message: "Chatbot is now live" , customerId});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default startChat;
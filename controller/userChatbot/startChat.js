import { liveServer } from "../../connections/server.js";

const startChat = async (req, res) => {
    const { slug } = req.params;
    console.log('slug'); 

    if (!slug) {
        return res.status(400).json({ message: "file slug is required" });
    }

    try {
        liveServer(slug);
        res.status(200).json({ message: "Chatbot is now live" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default startChat;
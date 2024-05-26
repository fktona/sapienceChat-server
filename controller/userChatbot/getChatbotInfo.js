import db from "../../models/index.js";
const file = db.File;

const getChatbotInfo = async (req, res) => {
    const {userId} = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User Id is required" });
    }

    const chatbotInfo = await file.find({ownerId:userId});

    try {
        if (!chatbotInfo.length) {
            return res.status(200).json({ message: "No files found for this user" });
        } else {
           return res.status(200).json({ chatbotInfo });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default getChatbotInfo;
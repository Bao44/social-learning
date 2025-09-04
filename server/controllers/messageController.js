const messageService = require("../services/messageService");

const messageController = {
    // Lưu tin nhắn mới
    saveMessage: async (req, res) => {
        const { conversationId, senderId, content } = req.body;
        try {
            const message = await messageService.saveMessage({ conversationId, senderId, content });
            res.status(201).json(message);
        } catch (error) {
            console.error("Error saving message:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = messageController;
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

const messageService = {
    // Lưu tin nhắn mới
    async saveMessage({ conversationId, senderId, content }) {
        // Tim conversation de kiem tra nguoi gui co thuoc conversation khong
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            throw new Error("Conversation not found");
        }
        if (!conversation.members.includes(senderId)) {
            throw new Error("Sender is not a member of the conversation");
        }
        const message = new Message({ 
            conversationId: conversation?._id, 
            senderId, 
            content 
        });
        await message.save();
        return message;
    }
};

module.exports = messageService;

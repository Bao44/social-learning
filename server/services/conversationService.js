const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const conversationService = {
    // Tao cuộc trò chuyện mới (riêng tư hoặc nhóm)
    async createConversation({ name, type, members, avatar, admin }) {
        const conversation = new Conversation({ name, type, members, avatar, admin });
        await conversation.save();
        return conversation;
    },

    // Lấy danh sách cuộc trò chuyện của người dùng
    async getUserConversations(userId) {
        const conversations = await Conversation.find({ members: userId }).sort({ updatedAt: -1 }); 
        return conversations;
    },
};

module.exports = conversationService;
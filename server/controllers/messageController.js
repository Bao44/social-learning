const messageService = require("../services/messageService");
const userService = require("../services/userService");
const { getIO } = require("../socket/socket");

const messageController = {
    // Lưu tin nhắn mới
    saveMessage: async (req, res) => {
        try {
            const { conversationId, senderId, text } = req.body;
            const files = req.files || []; // từ multer

            const message = await messageService.saveMessage({ conversationId, senderId, text, files });

            // custom message với sender info
            const { data: user } = await userService.getUserData(senderId);

            // Custom format
            const customMessage = {
                _id: message._id,
                conversationId: message.conversationId,
                senderId: message.senderId,
                content: {
                    type: message.content.type,
                    text: message.content.text,
                    images: message.content.images || [],
                    file: message.content.file || null,
                    system: message.content.system || { target: [] }
                },
                revoked: message.revoked || false,
                seens: message.seens || [],
                likes: message.likes || [],
                removed: message.removed || [],
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
                __v: message.__v,
                sender: user ? {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                } : null
            };

            // Gửi socket tới các thành viên trong conversation (nếu có)
            const io = getIO();
            io.to(conversationId).emit("newMessage", customMessage);

            res.status(201).json(message);
        } catch (error) {
            console.error("Error saving message:", error);
            res.status(500).json({ error: error.message });
        }
    },

    // Lấy danh sách tin nhắn trong cuộc trò chuyện với phân trang
    getMessagesByConversationId: async (req, res) => {
        try {
            const { conversationId } = req.params;
            const { page, limit } = req.query;
            const messages = await messageService.getMessagesByConversationId(conversationId, { page: parseInt(page) || 1, limit: parseInt(limit) || 20 });
            res.status(200).json(messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
            res.status(500).json({ error: error.message });
        }
    },
};

module.exports = messageController;

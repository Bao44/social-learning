const conversationService = require("../services/conversationService");
const userService = require("../services/userService");

const conversationController = {
    // Tạo cuộc trò chuyện mới (riêng tư hoặc nhóm)
    createConversation: async (req, res) => {
        const { name, type, members, avatar, admin } = req.body;
        try {
            const conversation = await conversationService.createConversation({ name, type, members, avatar, admin });
            res.status(201).json(conversation);
        } catch (error) {
            console.error("Error creating conversation:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    // Lấy danh sách cuộc trò chuyện của người dùng
    getUserConversations: async (req, res) => {
        const userId = req.params.userId;
        try {
            const conversations = await conversationService.getUserConversations(userId);

            const formattedConversations = await Promise.all(
                conversations.map(async (conversation) => {
                    // Lấy thông tin members
                    const members = await Promise.all(
                        conversation.members.map(async (memberId) => {
                            const user = await userService.getUserData(memberId);
                            return {
                                id: user ? user.data.id : memberId,
                                name: user ? user.data.name : "Unknown",
                                avatarUrl: user?.data.avatar || "/default-avatar-profile-icon.jpg"
                            };
                        })
                    );

                    // Lấy tin nhắn cuối cùng
                    let lastMessageText = "";
                    if (conversation.lastMessage) {
                        const lastMessage = await conversation.populate("lastMessage");
                        lastMessageText = lastMessage?.lastMessage?.content || "";
                    }

                    return {
                        id: conversation._id.toString(),
                        name: conversation.name || "", // có thể để fallback từ member nếu là private
                        avatarUrl: conversation.avatar || "/default-avatar-profile-icon.jpg",
                        members,
                        lastMessage: lastMessageText,
                        type: conversation.type
                    };
                })
            );

            res.status(200).json(formattedConversations);
        } catch (error) {
            console.error("Error fetching user conversations:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
};

module.exports = conversationController;
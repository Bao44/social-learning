const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "",
        },
        type: {
            type: String,
            enum: ["private", "group"],
            default: "private",
        },
        members: [
            {
                userId: { type: String, required: true },
                role: {
                    type: String,
                    enum: ["member", "admin"],
                    default: "member",
                },
                addBy: { type: String },
                joinedAt: { type: Date, default: Date.now },
            },
        ],
        avatar: {
            type: String,
            default: "",
        },
        admin: {
            type: String
        },
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        delete_history: [
            {
                userId: { type: String },
                deletedAt: { type: Date, default: Date.now },
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isApprovedMembers: {
            type: Boolean,
            default: false,
        },
        listApprovedMembers: [
            {
                type: String
            }
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);

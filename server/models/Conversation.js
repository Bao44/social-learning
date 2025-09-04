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
                type: String
            }
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
                _id: false,
                userId: {
                    type: String
                },
                time_delete: {
                    type: Date,
                    default: Date.now,
                }
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
        approvedMembers: {
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

"use client";

import { ChevronDown, SquarePen } from "lucide-react";
import CardChat from "./CardChat";

const conversations = [
    {
        id: "1",
        name: "John Doe asfasdfasdf sdfasdfasdf ádfasdf ádfasdfad",
        avatarUrl: "/default-avatar-profile-icon.jpg",
        participants: [
            {
                id: "1",
                name: "John Doe",
                avatarUrl: "/default-avatar-profile-icon.jpg",
            },
            // Add more participants as needed
        ],
        lastMessage: "Hey, how's it going?",
    },
    {
        id: "2",
        name: "Jane Smith",
        avatarUrl: "/default-avatar-profile-icon.jpg",
        participants: [
            {
                id: "2",
                name: "Jane Smith",
                avatarUrl: "/default-avatar-profile-icon.jpg",
            },
        ],
        lastMessage: "Are we still on for tomorrow?",
    },
    {
        id: "3",
        name: "Alice Johnson",
        avatarUrl: "/default-avatar-profile-icon.jpg",
        participants: [
            {
                id: "3",
                name: "Alice Johnson",
                avatarUrl: "/default-avatar-profile-icon.jpg",
            },
        ],
        lastMessage: "Let's catch up soon!",
    }
];

export default function ListConversation() {
    return (
        <div className="h-screen flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">nguyenvana123</h2>
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                </div>
                <SquarePen className="w-6 h-6 text-gray-500" />
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>

            <h3 className="px-4 py-2 font-semibold">Tin nhắn</h3>

            {/* List of Conversations */}
            <div className="flex-1 overflow-y-auto pb-18">
                {conversations.map((conversation) => (
                    <CardChat key={conversation.id} conversation={conversation} />
                ))}
            </div>
        </div>
    );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/utils/formatTime";

type MemberSeen = {
    id: string;
    name: string;
    avatarUrl: string;
};

// Update Message type to allow memberSeens to be an array
export type Message = {
    id: string;
    content: {
        type: string;
        text: string;
        images: any[];
        file: any;
    };
    sender: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    replyTo: any;
    revoked: boolean;
    memberSeens: MemberSeen[];
    like: any[];
    createdAt: string;
    updatedAt: string;
};

interface MessageReceiverProps {
    message: Message;
}

export default function MessageReceiver({ message }: MessageReceiverProps) {
    return (
        <div className="flex justify-start">
            <div className="max-w-2/3 flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={message?.sender?.avatarUrl} alt={message?.sender?.name} className="rounded-full" />
                    <AvatarFallback className="bg-gray-300">{message?.sender?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg shadow-md">
                    <p className="text-base">{message.content.text}</p>
                    <p className="text-gray-500 text-sm text-right">{formatTime(message.createdAt)}</p>
                </div>
            </div>
        </div>
    );
}

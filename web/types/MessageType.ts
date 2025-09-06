export type UserMini = {
    id: string;
    name: string;
};

export type FileContent = {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
};

export type ImageContent = {
    url: string;
    filename: string;
};

export type SystemContent = {
    action: "user_joined" | "user_left" | "conversation_renamed" | "member_added" | "member_removed";
    actor: UserMini;
    target?: UserMini[];
    newName?: string;
};

export type MessageContent =
    | { type: "text"; text: string; images?: never; file?: never; system?: never }
    | { type: "image"; text?: string; images: ImageContent[]; file?: never; system?: never }
    | { type: "file"; text?: string; file: FileContent; images?: never; system?: never }
    | { type: "video" | "audio"; text?: string; file: FileContent; images?: never; system?: never }
    | { type: "system"; system: SystemContent; text?: never; images?: never; file?: never };

export type Seen = {
    userId: string;
    seenAt: string; // ISO date string
};

export type Like = {
    userId: string;
    likedAt: string; // ISO date string
};

export type Message = {
    _id: string;
    conversationId: string;
    senderId: string;
    content: MessageContent;
    seens: Seen[];
    replyTo?: string | Message;
    likes: Like[];
    revoked: boolean;
    removed: { userId: string; removedAt: string }[];
    createdAt: string;
    updatedAt: string;
};

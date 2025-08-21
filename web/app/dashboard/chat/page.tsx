import ListConversation from "./components/ListConversation";

export default function ChatPage() {
    return (
        <div className="grid grid-cols-4 w-full max-h-[calc(100vh-66px)]">
            {/* List Conversations */}
            <div className="col-span-1 h-full w-full min-w-sm border-r border-gray-200">
                <ListConversation />
            </div>

            {/* Main Chat Area */}
            <div className="col-span-3">
                {/* Render the main chat area here */}
            </div>
        </div>
    );
}

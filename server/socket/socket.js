const { Server } = require("socket.io");

let io;

function socketInit(server) {
    io = new Server(server, {
        cors: { origin: "*" },
        transports: ["websocket", "polling"]
    });

    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        socket.on("joinRoom", (conversationId) => {
            console.log("User joined room:", conversationId);
            socket.join(conversationId);
        });

        socket.on("leaveRoom", (conversationId) => {
            console.log("User left room:", conversationId);
            socket.leave(conversationId);
        });

        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io has not been initialized! Call socketInit(server) first.");
    }
    return io;
}

module.exports = { socketInit, getIO };

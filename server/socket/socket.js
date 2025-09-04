// server/socket/socket.js
const { Server } = require("socket.io");

function socketInit(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", // đổi thành domain frontend của bạn (vd: http://localhost:3000)
        },
        transports: ["websocket", "polling"]
    });

    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        // Lắng nghe sự kiện từ client

        // Khi user ngắt kết nối
        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });

    return io;
}

module.exports = socketInit;

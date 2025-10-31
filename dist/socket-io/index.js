"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const auth_middleware_1 = require("./middleware_socket/auth.middleware");
const chat_1 = require("./chat");
const connectedUsers = new Map();
const initSocket = (server) => {
    const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
    io.use(auth_middleware_1.socketAuth);
    io.on("connection", (socket) => {
        const userId = socket.data.user.id;
        connectedUsers.set(socket.data.user.id, socket.id);
        io.emit("userOnline", { userId });
        socket.emit("onlineUsers", { users: Array.from(connectedUsers.keys()) });
        socket.on("sendMessage", (0, chat_1.sendMessage)(socket, io, connectedUsers));
        socket.on("typing", (data) => {
            const destSocket = connectedUsers.get(data.destId);
            if (destSocket) {
                io.to(destSocket).emit("typing", { sender: socket.data.user.id, typing: data.typing });
            }
        });
    });
};
exports.initSocket = initSocket;

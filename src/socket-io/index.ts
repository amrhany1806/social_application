import { Server as httpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { socketAuth } from "./middleware_socket/auth.middleware";
import { sendMessage } from "./chat";

const connectedUsers = new Map<string, string>();

export const initSocket = (server: httpServer) => {
    const io = new Server(server, { cors: { origin: "*" } });
    io.use(socketAuth);
    io.on("connection", (socket: Socket) => {
        const userId = socket.data.user.id;
        connectedUsers.set(socket.data.user.id, socket.id);


        io.emit("userOnline", { userId });

    socket.emit("onlineUsers", { users: Array.from(connectedUsers.keys()) });

        socket.on("sendMessage", sendMessage(socket, io, connectedUsers))

    socket.on("typing", (data: { destId: string; typing: boolean }) => {
    const destSocket = connectedUsers.get(data.destId);
    if (destSocket) {
        io.to(destSocket).emit("typing", { sender: socket.data.user.id, typing: data.typing });
    }
});
    });
};





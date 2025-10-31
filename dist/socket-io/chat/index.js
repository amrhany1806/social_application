"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = void 0;
const DB_1 = require("../../DB");
const sendMessage = (socket, io, connectedUsers) => {
    return async (data) => {
        const destSocket = connectedUsers.get(data.destId);
        socket.emit("successMessage", data);
        io.to(destSocket).emit("receiveMessage", data);
        const messageRepo = new DB_1.MessageRepository();
        const sender = socket.data.user.id;
        const createdmessage = await messageRepo.create({
            content: data.message, sender,
        });
        const chatRepo = new DB_1.ChatRepository();
        const chat = await chatRepo.getOne({
            users: { $all: [sender, data.destId] }
        });
        if (!chat) {
            await chatRepo.create({
                users: [sender, data.destId],
                messages: [createdmessage._id]
            });
        }
        else {
            await chatRepo.update({ _id: chat._id }, { $push: { messages: createdmessage._id } });
        }
    };
};
exports.sendMessage = sendMessage;

import { Server, Socket } from "socket.io"
import { ChatRepository, MessageRepository } from "../../DB"
import { ObjectId } from "mongoose"

interface IsendMessage {
    message: string,
    destId: string
}

export const sendMessage = (socket: Socket, io: Server, connectedUsers: Map<string, string>) => {
    return async (data: IsendMessage) => {

        const destSocket = connectedUsers.get(data.destId)

        socket.emit("successMessage", data)

        io.to(destSocket).emit("receiveMessage", data);

        const messageRepo = new MessageRepository();
        const sender = socket.data.user.id;



        const createdmessage = await messageRepo.create({
            content: data.message, sender,
        });

        const chatRepo = new ChatRepository();
        const chat = await chatRepo.getOne({
            users: { $all: [sender, data.destId] }
        })

        if (!chat) {
            await chatRepo.create({
                users: [sender, data.destId],
                messages: [createdmessage._id as unknown as ObjectId]
            })

        }

        else {
            await chatRepo.update({ _id: chat._id }, { $push: { messages: createdmessage._id } })
        }

        

        

    }

}
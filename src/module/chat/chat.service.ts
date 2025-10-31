import { Request, Response } from "express";
import { ChatRepository } from "../../DB";

class ChatService {
    private readonly chatrepository = new ChatRepository()
    getChat = async(req: Request, res: Response) => {
        const { userId } = req.params;

        const userLoginId = req.user.id;

    const chat =   await  this.chatrepository.getOne({
            users: { $all: [userId, userLoginId] }
        },{},{populate:[{path:"messages"}]})

        return res.json({message:"done", success:true, data:{chat}})

    }


}


export default new ChatService();

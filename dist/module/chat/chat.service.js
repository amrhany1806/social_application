"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
class ChatService {
    chatrepository = new DB_1.ChatRepository();
    getChat = async (req, res) => {
        const { userId } = req.params;
        const userLoginId = req.user.id;
        const chat = await this.chatrepository.getOne({
            users: { $all: [userId, userLoginId] }
        }, {}, { populate: [{ path: "messages" }] });
        return res.json({ message: "done", success: true, data: { chat } });
    };
}
exports.default = new ChatService();

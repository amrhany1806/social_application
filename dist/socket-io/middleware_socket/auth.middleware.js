"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
const token_1 = require("../../utilis/token");
const User_Repository_1 = __importDefault(require("../../DB/model/user/User.Repository"));
const utilis_1 = require("../../utilis");
const socketAuth = async (socket, next) => {
    try {
        const { authorization } = socket.handshake.auth;
        const payload = (0, token_1.verifyToken)(authorization);
        const Userrepository = new User_Repository_1.default();
        const user = await Userrepository.getOne({ _id: payload._id });
        if (!user) {
            throw new utilis_1.NotFoundError("user not found");
        }
        socket.data.user = user;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.socketAuth = socketAuth;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const token_1 = require("../utilis/token");
const User_Repository_1 = __importDefault(require("../DB/model/user/User.Repository"));
const utilis_1 = require("../utilis");
const isAuthenticated = () => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        const payload = (0, token_1.verifyToken)(token);
        const userRepository = new User_Repository_1.default();
        const user = await userRepository.exist({ _id: payload._id }, {}, { populate: [{ path: "friends", select: "fullName firstName lastName" }] });
        if (!user) {
            throw new utilis_1.NotFoundError("user not found");
        }
        req.user = user;
        next();
    };
};
exports.isAuthenticated = isAuthenticated;

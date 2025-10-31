"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProvider = void 0;
const User_Repository_1 = __importDefault(require("../../../DB/model/user/User.Repository"));
const utilis_1 = require("../../../utilis");
exports.authProvider = {
    async checkOTP(verifyAccountDto) {
        const userRepository = new User_Repository_1.default();
        const userExist = await userRepository.exist({ email: verifyAccountDto.email });
        if (!userExist) {
            throw new utilis_1.BadRequestError("user not found");
        }
        if (userExist.otp != verifyAccountDto.otp) {
            throw new utilis_1.BadRequestError("invalid otp");
        }
        if (userExist.otpExpiry < new Date()) {
            throw new utilis_1.BadRequestError("expired otp");
        }
    },
    async updateUser(filter, update) {
        const userRepository = new User_Repository_1.default();
        await userRepository.update(filter, update);
    },
};

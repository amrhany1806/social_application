"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const enum_1 = require("../../../utilis/common/enum");
const hash_1 = require("../../../utilis/hash");
const otp_1 = require("../../../utilis/otp");
const entity_1 = require("../entity");
class AuthFactoryService {
    async register(registerdto) {
        const user = new entity_1.User();
        user.fullName = registerdto.fullName;
        user.email = registerdto.email;
        user.password = await (0, hash_1.generateHash)(registerdto.password);
        user.phoneNumber = registerdto.phoneNumber;
        user.otp = (0, otp_1.generateOtp)();
        user.otpExpiry = (0, otp_1.generateExpiryDate)(5 * 60 * 60 * 1000);
        user.gender = registerdto.gender;
        user.role = enum_1.SYS_ROLE.user;
        user.userAgent = enum_1.USER_AGENT.local;
        user.credentialsUpdateAt = Date.now();
        user.isVerified = false;
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;

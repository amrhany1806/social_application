"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_Repository_1 = __importDefault(require("../../DB/model/user/User.Repository"));
const utilis_1 = require("../../utilis");
const factory_1 = require("./factory");
const email_1 = require("../../utilis/email");
const auth_provider_1 = require("./provider/auth.provider");
const hash_1 = require("../../utilis/hash");
const token_1 = require("../../utilis/token");
class AuthService {
    userRepository = new User_Repository_1.default();
    authfactoryservice = new factory_1.AuthFactoryService();
    constructor() { }
    register = async (req, res) => {
        const registerDto = req.body;
        const userExist = await this.userRepository.exist({ email: registerDto.email });
        if (userExist) {
            throw new utilis_1.ConflictError("User already exists");
        }
        const user = await this.authfactoryservice.register(registerDto);
        const createdUser = await this.userRepository.create(user);
        await (0, email_1.sendEmail)({ to: registerDto.email, subject: "Verify your email", html: `<h1>your otp is ${user.otp}</h1>` });
        return res.status(200).json({ message: "User created successfully", success: true, data: { id: createdUser.id } });
    };
    verfiyAccount = async (req, res) => {
        const verifyAccountDto = req.body;
        await auth_provider_1.authProvider.checkOTP(verifyAccountDto);
        this.userRepository.update({ email: verifyAccountDto.email }, { isVerified: true, $unset: { otp: "", otpExpiry: "" } });
        return res.status(204).json({ message: "done", success: true });
    };
    login = async (req, res) => {
        const loginDto = req.body;
        const userExist = await this.userRepository.exist({ email: loginDto.email });
        if (!userExist) {
            throw new utilis_1.ForbiddenError("invalid credentials");
        }
        const passwordMatch = await (0, hash_1.compareHash)(loginDto.password, userExist.password);
        if (!passwordMatch) {
            throw new utilis_1.ForbiddenError("invalid credentials");
        }
        if (userExist.twoFactorEnabled) {
            if (userExist.twoFactorOtp &&
                userExist.twoFactorOtpExpiry &&
                userExist.twoFactorOtpExpiry.getTime() > Date.now()) {
                throw new utilis_1.BadRequestError("OTP not expired yet. Please check your email.");
            }
        }
        const otp = (0, utilis_1.generateOtp)().toString();
        await this.userRepository.update({ email: loginDto.email }, {
            $set: {
                twoFactorOtp: await (0, hash_1.generateHash)(otp),
                twoFactorOtpExpiry: (0, utilis_1.generateExpiryDate)(2 * 60 * 60 * 1000),
            },
        });
        await (0, email_1.sendEmail)({
            to: loginDto.email,
            subject: "Enable 2FA",
            html: `<h1>Your OTP is ${otp}</h1>`,
        });
        const accessToken = (0, token_1.generateToken)({
            payload: { _id: userExist._id, role: userExist.role },
            options: { expiresIn: "1d" },
        });
        const RefreshToken = (0, token_1.generateToken)({
            payload: { _id: userExist._id, role: userExist.role },
            options: { expiresIn: "7d" }
        });
        await this.userRepository.update({ _id: userExist._id }, { $set: { RefreshToken } });
        if (userExist.twoFactorEnabled) {
            return res.status(200).json({
                message: "2FA OTP sent successfully",
                success: true,
            });
        }
        return res.status(200).json({
            message: "done",
            success: true,
            data: { accessToken, RefreshToken },
        });
    };
    confirmLogin = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userRepository.exist({ email });
        if (!user)
            throw new utilis_1.ForbiddenError("invalid credentials");
        if (user.twoFactorOtpExpiry && user.twoFactorOtpExpiry.getTime() < Date.now()) {
            throw new utilis_1.BadRequestError("two step verification otp expired");
        }
        if (!user.twoFactorOtp)
            throw new utilis_1.BadRequestError("OTP not found");
        const isValid = await (0, hash_1.compareHash)(otp, user.twoFactorOtp);
        if (!isValid)
            throw new utilis_1.BadRequestError("invalid otp");
        await this.userRepository.update({ email }, { $set: { twoFactorEnabled: true }, $unset: { twoFactorOtp: 1, twoFactorOtpExpiry: 1 } });
        const accessToken = (0, token_1.generateToken)({
            payload: { _id: user._id, role: user.role },
            options: { expiresIn: "1d" },
        });
        return res.status(200).json({
            message: "Account confirmed successfully",
            accessToken,
        });
    };
}
;
exports.default = new AuthService();

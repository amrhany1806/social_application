"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_Repository_1 = __importDefault(require("../../DB/model/user/User.Repository"));
const utilis_1 = require("../../utilis");
const email_1 = require("../../utilis/email");
const friendReq_repository_1 = require("./../../DB/model/friendRequest/friendReq.repository");
class UserService {
    userRepository = new User_Repository_1.default();
    friendReqRepository = new friendReq_repository_1.friendReqRepository();
    getProfile = async (req, res, next) => {
        return res.status(200).json({ message: "User found successfully", success: true, data: { user: req.user } });
    };
    updateBasicInfo = async (req, res, next) => {
        const userId = req.user?._id;
        const { fullName, gender, phoneNumber } = req.body;
        const user = await this.userRepository.exist({ _id: userId });
        if (!user) {
            throw new utilis_1.NotFoundError("user not found");
        }
        if (fullName) {
            user.fullName = fullName;
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }
        if (gender) {
            user.gender = gender;
        }
        await this.userRepository.update({ _id: userId }, user);
        return res.status(200).json({
            message: "info updated successfully",
            success: true,
            data: { user }
        });
    };
    updatePassword = async (req, res, next) => {
        const userId = req.user?._id;
        const { oldPassword, newPassword } = req.body;
        const user = await this.userRepository.exist({ _id: userId });
        if (!user) {
            throw new utilis_1.NotFoundError("user not found");
        }
        const isMatch = await (0, utilis_1.compareHash)(oldPassword, user.password);
        if (!isMatch) {
            throw new utilis_1.BadRequestError("invalid old password");
        }
        user.password = await (0, utilis_1.generateHash)(newPassword);
        user.credentialsUpdateAt = new Date();
        await user.save();
        return res.status(200).json({
            message: "password updated successfully",
            success: true,
            data: { user }
        });
    };
    updateEmail = async (req, res) => {
        try {
            const userId = req.user?._id;
            const { newEmail } = req.body;
            const user = await this.userRepository.exist({ _id: userId });
            if (!user)
                throw new utilis_1.NotFoundError("User not found");
            if (user.email === newEmail)
                throw new utilis_1.BadRequestError("New email cannot be the same");
            const emailExist = await this.userRepository.exist({ email: newEmail });
            if (emailExist)
                throw new utilis_1.ConflictError("Email already exists");
            const otp = (0, utilis_1.generateOtp)();
            const otpExpiry = (0, utilis_1.generateExpiryDate)(5 * 60 * 60 * 1000);
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            user.isVerified = false;
            await user.save();
            await (0, email_1.sendEmail)({
                to: newEmail,
                subject: "Verify your new email",
                html: `<h1>Your OTP is ${otp}</h1>`
            });
            return res.status(200).json({
                message: "OTP sent to new email successfully",
                success: true
            });
        }
        catch (error) {
            return res.status(500).json({ massege: "server errror", error: error.message });
        }
    };
    confirmEmail = async (req, res) => {
        const userId = req.user?._id;
        const { newEmail, otp } = req.body;
        const user = await this.userRepository.exist({ _id: userId });
        if (!user)
            throw new utilis_1.NotFoundError("User not found");
        if (user.otpExpiry && user.otpExpiry < new Date())
            throw new utilis_1.BadRequestError("OTP expired");
        if (user.otp !== otp)
            throw new utilis_1.BadRequestError("Invalid OTP");
        user.otp = undefined;
        user.otpExpiry = undefined;
        await this.userRepository.update({ _id: userId }, { email: newEmail, isVerified: true });
        await user.save();
        return res.status(200).json({
            message: "Email updated successfully",
            success: true
        });
    };
    enable2FA = async (req, res) => {
        const email = req.user?.email;
        const otp = (0, utilis_1.generateOtp)();
        if (req.user?.twoFactorEnabled) {
            throw new utilis_1.BadRequestError("2FA already enabled");
        }
        if (req.user?.twoFactorOtp && req.user?.twoFactorOtpExpiry.getTime() > Date.now()) {
            throw new utilis_1.BadRequestError("ot not expired yet");
        }
        await this.userRepository.update({ email }, { $set: { twoFactorOtp: await (0, utilis_1.generateHash)(String(otp)), twoFactorOtpExpiry: (0, utilis_1.generateExpiryDate)(2 * 60 * 60 * 1000) } });
        await (0, email_1.sendEmail)({ to: email, subject: "Enable 2FA", html: `<h1>your otp is ${otp}</h1>` });
        return res.status(200).json({ message: "otp sent successfully" });
    };
    Verfiy2FA = async (req, res) => {
        const { otp } = req.body;
        const email = req.user?.email;
        if (req.user?.twoFactorOtpExpiry?.getTime() < Date.now()) {
            throw new utilis_1.BadRequestError("otp Expired");
        }
        if (!await (0, utilis_1.compareHash)(otp, req.user?.twoFactorOtp)) {
            throw new utilis_1.BadRequestError("otp is Not Match");
        }
        await this.userRepository.update({ email }, { $set: { twoFactorEnabled: true }, $unset: { twoFactorOtp: 1, twoFactorOtpExpiry: 1 } });
        return res.status(200).json({ message: "2FA enabled successfully" });
    };
    SendFriendReq = async (req, res) => {
        try {
            const userId = req.user?._id;
            const user = req.user;
            const { reciptionId } = req.params;
            if (!userId) {
                throw new utilis_1.NotFoundError("user not found");
            }
            if (userId.toString() === reciptionId) {
                return res.status(400).json({ message: "you cant add yourself" });
            }
            const reciptionExist = await this.userRepository.exist({ _id: reciptionId });
            if (!reciptionExist) {
                throw new utilis_1.NotFoundError("recipient not found");
            }
            if (user.blockUsers.includes(reciptionExist._id) || user.blockedBy.includes(userId) || reciptionExist.blockUsers.includes(userId) || reciptionExist.blockedBy.includes(userId)) {
                throw new utilis_1.NotAuthorizedError("User Not Available");
            }
            const existing = await this.friendReqRepository.exist({ from: userId, to: reciptionId, status: utilis_1.FriendRequestStatus.pending });
            if (existing) {
                return res.status(400).json({ meessage: "Request already exist" });
            }
            const alreadyfriend = await this.friendReqRepository.exist({ from: userId, to: reciptionId, status: utilis_1.FriendRequestStatus.accepted });
            if (alreadyfriend) {
                throw new utilis_1.ConflictError("you already friends");
            }
            const newRequest = await this.friendReqRepository.create({ from: userId, to: reciptionId });
            return res.status(201).json({ message: "friend Request Sent Successfully", success: true, request: newRequest });
        }
        catch (error) {
            return res.json({ error: error.message });
        }
    };
    AcceptFriendReq = async (req, res) => {
        const userId = req.user?._id;
        const user = req.user;
        const { requestId } = req.params;
        if (!userId)
            throw new utilis_1.NotFoundError("user not found");
        const friendReq = await this.friendReqRepository.exist({ _id: requestId });
        if (!friendReq)
            throw new utilis_1.NotFoundError("Friend request not found");
        if (friendReq.to.toString() !== userId.toString())
            throw new utilis_1.ForbiddenError("You are not allowed to accept this request");
        if (friendReq.status !== utilis_1.FriendRequestStatus.pending)
            throw new utilis_1.ConflictError("Request is not pending");
        friendReq.status = utilis_1.FriendRequestStatus.accepted;
        await friendReq.save();
        await this.userRepository.update({ _id: userId }, { $addToSet: { friends: friendReq.from } });
        await this.userRepository.update({ _id: friendReq.from }, { $addToSet: { friends: friendReq.to } });
        return res
            .status(201)
            .json({ message: "Friend request accepted successfully", success: true, newFriend: friendReq });
    };
    deleteFriendReq = async (req, res) => {
        const user = req.user;
        const { friendReqId } = req.params;
        const friendReqExist = await this.friendReqRepository.exist({ _id: friendReqId, status: utilis_1.FriendRequestStatus.pending });
        if (!friendReqExist) {
            throw new utilis_1.NotFoundError("Friend Request Not Found");
        }
        const isParticipant = friendReqExist.from.toString() == user?._id?.toString() ||
            friendReqExist.to.toString() == user?._id?.toString();
        if (!isParticipant) {
            throw new utilis_1.ForbiddenError("you are not allowed to delete this");
        }
        await this.friendReqRepository.delete({ _id: friendReqId });
        return res.status(201).json({ message: "Freind Request Deleted Successfully" });
    };
    Unfriend = async (req, res) => {
        const { friendId } = req.params;
        const user = req.user;
        if (user?.id?.toString() == friendId) {
            throw new utilis_1.ConflictError(" you cant unfriend yourself");
        }
        const friend = await (await this.userRepository.exist({ _id: friendId }));
        if (!friend) {
            throw new utilis_1.NotFoundError("friend Not found");
        }
        await this.userRepository.update({ _id: user._id }, { $pull: { friends: friend._id } });
        await this.userRepository.update({ _id: friend._id }, { $pull: { friends: user._id } });
        return res.status(200).json({ message: "done", success: true });
    };
    BlockUser = async (req, res) => {
        const { BlockUserId } = req.params;
        const user = req.user;
        if (user?.id?.toString() == BlockUserId) {
            throw new utilis_1.ConflictError(" you cant block yourself");
        }
        const target = await (await this.userRepository.exist({ _id: BlockUserId }));
        if (!target) {
            throw new utilis_1.NotFoundError("user to be blocked Not found");
        }
        if (user.blockUsers.includes(target._id)) {
            throw new utilis_1.ConflictError("this user already blocked");
        }
        if (!user.friends.includes(target?._id)) {
            await this.userRepository.update({ _id: user?._id }, { $pull: { friends: target._id } });
            await this.userRepository.update({ _id: target._id }, { $pull: { friends: user?._id } });
        }
        await this.userRepository.update({ _id: user._id }, { $addToSet: { blockUsers: target._id } });
        return res.status(200).json({ message: "done", success: true });
    };
}
;
exports.default = new UserService();

import { NextFunction, Request, Response } from "express";
import UserRepository from "../../DB/model/user/User.Repository";
import { ConfirmEmailDto, UpdateEmailDto, updateInfoDto, updatePass } from "../../DB/model/user/user.dto";
import { BadRequestError, compareHash, ConflictError, ForbiddenError, FriendRequestStatus, generateExpiryDate, generateHash, generateOtp, NotAuthorizedError, NotFoundError } from "../../utilis";
import { sendEmail } from "../../utilis/email";
import { friendReqRepository } from './../../DB/model/friendRequest/friendReq.repository';
import { ObjectId } from "mongoose";

class UserService {

   private readonly userRepository = new UserRepository();

   private readonly friendReqRepository = new friendReqRepository()

   getProfile = async (req: Request, res: Response, next: NextFunction) => {


      return res.status(200).json({ message: "User found successfully", success: true, data: { user: req.user } })

   }

   updateBasicInfo = async (req: Request, res: Response, next: NextFunction) => {

      const userId = req.user?._id;

      const { fullName, gender, phoneNumber }: updateInfoDto = req.body;

      const user = await this.userRepository.exist({ _id: userId })

      if (!user) {
         throw new NotFoundError("user not found")
      }

      if (fullName) {
         user.fullName = fullName
      }

      if (phoneNumber) {
         user.phoneNumber = phoneNumber
      }
      if (gender) {
         user.gender = gender
      }



      await this.userRepository.update({ _id: userId }, user);

      return res.status(200).json({
         message: "info updated successfully",
         success: true,
         data: { user }
      });

   }
   updatePassword = async (req: Request, res: Response, next: NextFunction) => {

      const userId = req.user?._id;

      const { oldPassword, newPassword }: updatePass = req.body;

      const user = await this.userRepository.exist({ _id: userId })

      if (!user) {
         throw new NotFoundError("user not found")
      }

      const isMatch = await compareHash(oldPassword, user.password);

      if (!isMatch) {
         throw new BadRequestError("invalid old password")
      }

      user.password = await generateHash(newPassword)

      user.credentialsUpdateAt = new Date()
      await user.save()

      return res.status(200).json({
         message: "password updated successfully",
         success: true,
         data: { user }
      });

   }

   updateEmail = async (req: Request, res: Response) => {

      try {
         const userId = req.user?._id;
         const { newEmail }: UpdateEmailDto = req.body;

         const user = await this.userRepository.exist({ _id: userId });
         if (!user) throw new NotFoundError("User not found");

         if (user.email === newEmail)
            throw new BadRequestError("New email cannot be the same");

         const emailExist = await this.userRepository.exist({ email: newEmail });
         if (emailExist) throw new ConflictError("Email already exists");


         const otp = generateOtp();
         const otpExpiry = generateExpiryDate(5 * 60 * 60 * 1000) as unknown as Date;

         user.otp = otp;
         user.otpExpiry = otpExpiry;
         user.isVerified = false;


         await user.save();


         await sendEmail({
            to: newEmail,
            subject: "Verify your new email",
            html: `<h1>Your OTP is ${otp}</h1>`
         });


         return res.status(200).json({
            message: "OTP sent to new email successfully",
            success: true
         });
      } catch (error) {
         return res.status(500).json({ massege: "server errror", error: error.message })
      }
   }

   confirmEmail = async (req: Request, res: Response) => {

      const userId = req.user?._id;
      const { newEmail, otp }: ConfirmEmailDto = req.body;

      const user = await this.userRepository.exist({ _id: userId });
      if (!user) throw new NotFoundError("User not found");


      if (user.otpExpiry && user.otpExpiry < new Date())
         throw new BadRequestError("OTP expired");

      if (user.otp !== otp) throw new BadRequestError("Invalid OTP");



      user.otp = undefined;
      user.otpExpiry = undefined;

      await this.userRepository.update({ _id: userId }, { email: newEmail, isVerified: true });


      await user.save();
      return res.status(200).json({
         message: "Email updated successfully",
         success: true
      });
   }


   enable2FA = async (req: Request, res: Response) => {

      const email = req.user?.email

      const otp = generateOtp();
      if (req.user?.twoFactorEnabled) {
         throw new BadRequestError("2FA already enabled")
      }

      if (req.user?.twoFactorOtp && req.user?.twoFactorOtpExpiry.getTime() > Date.now()) {
         throw new BadRequestError("ot not expired yet")
      }

      await this.userRepository.update({ email }, { $set: { twoFactorOtp: await generateHash(String(otp)), twoFactorOtpExpiry: generateExpiryDate(2 * 60 * 60 * 1000) } })

      await sendEmail({ to: email, subject: "Enable 2FA", html: `<h1>your otp is ${otp}</h1>` })

      return res.status(200).json({ message: "otp sent successfully" })
   }


   Verfiy2FA = async (req: Request, res: Response) => {

      const { otp } = req.body;

      const email = req.user?.email

      if (req.user?.twoFactorOtpExpiry?.getTime() as number < Date.now()) {
         throw new BadRequestError("otp Expired")
      }

      if (! await compareHash(otp, req.user?.twoFactorOtp as string)) {
         throw new BadRequestError("otp is Not Match")
      }

      await this.userRepository.update({ email }, { $set: { twoFactorEnabled: true }, $unset: { twoFactorOtp: 1, twoFactorOtpExpiry: 1 } })





      return res.status(200).json({ message: "2FA enabled successfully" })
   }

   SendFriendReq = async (req: Request, res: Response) => {

      try {
         const userId = req.user?._id;

         const user = req.user;

         const { reciptionId } = req.params;


         if (!userId) {
            throw new NotFoundError("user not found")
         }

         if (userId.toString() === reciptionId) {
            return res.status(400).json({ message: "you cant add yourself" })
         }


         const reciptionExist = await this.userRepository.exist({ _id: reciptionId })

         if (!reciptionExist) {
            throw new NotFoundError("recipient not found")
         }

         if (user.blockUsers.includes(reciptionExist._id) || user.blockedBy.includes(userId) || reciptionExist.blockUsers.includes(userId) || reciptionExist.blockedBy.includes(userId)) {
            throw new NotAuthorizedError("User Not Available")
         }

         const existing = await this.friendReqRepository.exist({ from: userId, to: reciptionId, status: FriendRequestStatus.pending })

         if (existing) {
            return res.status(400).json({ meessage: "Request already exist" })
         }

         const alreadyfriend = await this.friendReqRepository.exist({ from: userId, to: reciptionId, status: FriendRequestStatus.accepted })

         if (alreadyfriend) {
            throw new ConflictError("you already friends")
         }
         const newRequest = await this.friendReqRepository.create({ from: userId, to: reciptionId as unknown as ObjectId })

         return res.status(201).json({ message: "friend Request Sent Successfully", success: true, request: newRequest })

      } catch (error) {
         return res.json({ error: error.message })
      }

   }

   AcceptFriendReq = async (req: Request, res: Response) => {
      const userId = req.user?._id;
      const user = req.user;
      const { requestId } = req.params;

      if (!userId) throw new NotFoundError("user not found");

      const friendReq = await this.friendReqRepository.exist({ _id: requestId });
      if (!friendReq) throw new NotFoundError("Friend request not found");

      if (friendReq.to.toString() !== userId.toString())
         throw new ForbiddenError("You are not allowed to accept this request");

      if (friendReq.status !== FriendRequestStatus.pending)
         throw new ConflictError("Request is not pending");

      friendReq.status = FriendRequestStatus.accepted;
      await friendReq.save();


      await this.userRepository.update(
         { _id: userId },
         { $addToSet: { friends: friendReq.from } }
      );

      await this.userRepository.update(
         { _id: friendReq.from },
         { $addToSet: { friends: friendReq.to } }
      );
      return res
         .status(201)
         .json({ message: "Friend request accepted successfully", success: true, newFriend: friendReq });
   };


   deleteFriendReq = async (req: Request, res: Response) => {

      const user = req.user;

      const { friendReqId } = req.params;


      const friendReqExist = await this.friendReqRepository.exist({ _id: friendReqId, status: FriendRequestStatus.pending })

      if (!friendReqExist) {
         throw new NotFoundError("Friend Request Not Found")
      }
      const isParticipant = friendReqExist.from.toString() == user?._id?.toString() ||

         friendReqExist.to.toString() == user?._id?.toString()

      if (!isParticipant) {
         throw new ForbiddenError("you are not allowed to delete this")
      }

      await this.friendReqRepository.delete({ _id: friendReqId })

      return res.status(201).json({ message: "Freind Request Deleted Successfully" })
   }


   Unfriend = async (req: Request, res: Response) => {

      const { friendId } = req.params;

      const user = req.user;

      if (user?.id?.toString() == friendId) {
         throw new ConflictError(" you cant unfriend yourself")
      }
      const friend = await (await this.userRepository.exist({ _id: friendId }))

      if (!friend) {
         throw new NotFoundError("friend Not found")
      }



      await this.userRepository.update({ _id: user._id }, { $pull: { friends: friend._id } })
      await this.userRepository.update({ _id: friend._id }, { $pull: { friends: user._id } })

      return res.status(200).json({ message: "done", success: true })


   }


   BlockUser = async (req: Request, res: Response) => {

      const { BlockUserId } = req.params;

      const user = req.user;

      if (user?.id?.toString() == BlockUserId) {
         throw new ConflictError(" you cant block yourself")
      }
      const target = await (await this.userRepository.exist({ _id: BlockUserId }))

      if (!target) {
         throw new NotFoundError("user to be blocked Not found")
      }

      if (user.blockUsers.includes(target._id)) {
         throw new ConflictError("this user already blocked")
      }

      if (!user.friends.includes(target?._id)) {
         await this.userRepository.update({ _id: user?._id }, { $pull: { friends: target._id } })
         await this.userRepository.update({ _id: target._id }, { $pull: { friends: user?._id } })
      }



      await this.userRepository.update({ _id: user._id }, { $addToSet: { blockUsers: target._id } })
      return res.status(200).json({ message: "done", success: true })


   }
};











export default new UserService();

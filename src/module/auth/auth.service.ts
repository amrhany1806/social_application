import type { NextFunction, Request, Response } from "express";
import { RegisterDto, VerifyAccountDto, LoginDto } from "./auth.dto";
import UserRepository from "../../DB/model/user/User.Repository";
import { BadRequestError, ConflictError, ForbiddenError, generateExpiryDate, generateOtp, NotFoundError } from "../../utilis";
import { AuthFactoryService } from "./factory";
import { sendEmail } from "../../utilis/email";
import { authProvider } from "./provider/auth.provider";
import { compareHash, generateHash } from "../../utilis/hash";
import { generateToken } from "../../utilis/token";



class AuthService {

    private userRepository = new UserRepository();
    private authfactoryservice = new AuthFactoryService();
    constructor() { }

    register = async (req: Request, res: Response) => {

        const registerDto: RegisterDto = req.body;


        const userExist = await this.userRepository.exist({ email: registerDto.email })

        if (userExist) {
            throw new ConflictError("User already exists")
        }

        const user = await this.authfactoryservice.register(registerDto)

        const createdUser = await this.userRepository.create(user);


        await sendEmail({ to: registerDto.email, subject: "Verify your email", html: `<h1>your otp is ${user.otp}</h1>` })

        return res.status(200).json({ message: "User created successfully", success: true, data: { id: createdUser.id } })


    }
    verfiyAccount = async (req: Request, res: Response) => {

        const verifyAccountDto: VerifyAccountDto = req.body;

        await authProvider.checkOTP(verifyAccountDto);

        this.userRepository.update({ email: verifyAccountDto.email }, { isVerified: true, $unset: { otp: "", otpExpiry: "" } })


        return res.status(204).json({ message: "done", success: true })
    };


    login = async (req: Request, res: Response) => {

        const loginDto: LoginDto = req.body;

        const userExist = await this.userRepository.exist({ email: loginDto.email });
        if (!userExist) {
            throw new ForbiddenError("invalid credentials");
        }

        const passwordMatch = await compareHash(loginDto.password, userExist.password);
        if (!passwordMatch) {
            throw new ForbiddenError("invalid credentials");
        }

        if (userExist.twoFactorEnabled) {
            if (
                userExist.twoFactorOtp &&
                userExist.twoFactorOtpExpiry &&
                userExist.twoFactorOtpExpiry.getTime() > Date.now()
            ) {
                throw new BadRequestError("OTP not expired yet. Please check your email.");
            }
        }



        const otp = generateOtp().toString();
        await this.userRepository.update(
            { email: loginDto.email },
            {
                $set: {
                    twoFactorOtp: await generateHash(otp),
                    twoFactorOtpExpiry: generateExpiryDate(2 * 60 * 60 * 1000),
                },
            }
        );

        await sendEmail({
            to: loginDto.email,
            subject: "Enable 2FA",
            html: `<h1>Your OTP is ${otp}</h1>`,
        });

        const accessToken = generateToken({
            payload: { _id: userExist._id, role: userExist.role },
            options: { expiresIn: "1d" },
        });

        const RefreshToken = generateToken({
            payload: { _id: userExist._id, role: userExist.role },
            options: { expiresIn: "7d" }
        })

await this.userRepository.update(
    { _id: userExist._id },
    { $set: { RefreshToken } }
  );

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



    confirmLogin = async (req: Request, res: Response) => {

        const { email, otp } = req.body;

        const user = await this.userRepository.exist({ email });
        if (!user) throw new ForbiddenError("invalid credentials");

        if (user.twoFactorOtpExpiry && user.twoFactorOtpExpiry.getTime() < Date.now()) {
            throw new BadRequestError("two step verification otp expired");
        }

        if (!user.twoFactorOtp) throw new BadRequestError("OTP not found");

        const isValid = await compareHash(otp, user.twoFactorOtp);
        if (!isValid) throw new BadRequestError("invalid otp");

        await this.userRepository.update(
            { email },
            { $set: { twoFactorEnabled: true }, $unset: { twoFactorOtp: 1, twoFactorOtpExpiry: 1 } }
        );

        const accessToken = generateToken({
            payload: { _id: user._id, role: user.role },
            options: { expiresIn: "1d" },
        });

        return res.status(200).json({
            message: "Account confirmed successfully",
            accessToken,
        });

    };


};






export default new AuthService();
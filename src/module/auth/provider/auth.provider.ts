import UserRepository from "../../../DB/model/user/User.Repository"
import { VerifyAccountDto , VerifyAccountDto2Fa} from "../auth.dto";
import { BadRequestError } from "../../../utilis";
import { FilterQuery } from "mongoose";
import { IUser } from "../../../utilis/common/interface";

export const authProvider = {

    async checkOTP(verifyAccountDto: VerifyAccountDto) {
        const userRepository = new UserRepository();

        const userExist = await userRepository.exist({ email: verifyAccountDto.email })
        if (!userExist) {
            throw new BadRequestError("user not found")
        }

        if (userExist.otp != verifyAccountDto.otp) {
            throw new BadRequestError("invalid otp")
        }
        if ((userExist.otpExpiry as Date) < new Date()) {
            throw new BadRequestError("expired otp")
        }

    } ,
   

   async updateUser(filter: FilterQuery<IUser>, update: any) {
        const userRepository = new UserRepository();
        await userRepository.update(filter, update)

    },



    
};




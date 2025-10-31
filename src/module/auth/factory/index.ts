import { SYS_ROLE, USER_AGENT } from "../../../utilis/common/enum";
import { generateHash } from "../../../utilis/hash";
import { generateExpiryDate, generateOtp } from "../../../utilis/otp";
import { RegisterDto } from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService {

   async  register(registerdto: RegisterDto) {
        const user = new User();

        user.fullName = registerdto.fullName as string;
        user.email = registerdto.email;
        user.password = await generateHash(registerdto.password);
        user.phoneNumber = registerdto.phoneNumber as string;
        user.otp = generateOtp();
        user.otpExpiry = generateExpiryDate(5 * 60 * 60 * 1000) as unknown as Date;
        user.gender = registerdto.gender;
        user.role = SYS_ROLE.user;
        user.userAgent = USER_AGENT.local;
        user.credentialsUpdateAt = Date.now() as unknown as Date;
        user.isVerified = false;
        return user;
    }


}
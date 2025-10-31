import { z } from "zod";
import { GENDER, USER_AGENT } from "../../utilis/common/enum";
import { RegisterDto } from "./auth.dto";

export const registerSchema = z.object<RegisterDto>({
  
    fullName:z.string().min(3).max(20) as unknown as string,
    email:z.email() as unknown as string,
    password:z.string() as unknown as string,
    phoneNumber:z.string().min(11).max(11) as unknown as string,
    gender:z.enum(GENDER) as unknown as GENDER,
    userAgent:z.enum(USER_AGENT) as unknown as USER_AGENT,
    

})
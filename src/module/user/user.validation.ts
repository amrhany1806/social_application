import { z } from "zod";
import { GENDER } from "../../utilis";

export const updateBasicInfo = z.object({

    fullName:z.string().optional(),
    phoneNumber:z.string().optional(),
    gender:z.enum(GENDER)

}).strict()


export const UpdatePassword = z.object({
    
oldPassword:z.string(),
newPassword:z.string(),
confirmPassword: z.string()

}).refine((data)=> data.newPassword === data.confirmPassword, {
    message:"password is not match",
    path:["confirmPassword"]
})

export const updateEmail = z.object({
    newEmail:z.email()
    
})
export const confrimEmail = z.object({
    newEmail:z.email(),
    otp:z.string()
})

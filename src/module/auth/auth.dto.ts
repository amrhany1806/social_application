import { GENDER, USER_AGENT } from "../../utilis/common/enum";

export interface RegisterDto {
    fullName?: string;
    email: string;
    password: string;
    phoneNumber?: string;
    gender: GENDER;
    userAgent: USER_AGENT;
}

export interface VerifyAccountDto {
    email: string;
    otp: string;
}
export interface VerifyAccountDto2Fa {
    otp: string;
}

export interface LoginDto {
    email: string;
    password: string;
}



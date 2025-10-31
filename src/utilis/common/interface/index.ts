import { JwtPayload } from "jsonwebtoken";
import { FriendRequestStatus, GENDER, REACTION, SYS_ROLE, USER_AGENT } from "../enum";
import { Request } from "express";
import { Document, ObjectId } from "mongoose";


export interface Iattachment {
    id: string;
    url: string;
}



export interface IUser {
    firstName: string;
    lastName: string;
    fullName?: string;
    email: string;
    password: string;
    credentialsUpdateAt: Date;
    phoneNumber?: string;
    role: SYS_ROLE;
    gender: GENDER;
    userAgent: USER_AGENT;
    otp?: string;
    otpExpiry?: Date;
    isVerified?: boolean;
    friends?: ObjectId[];
    twoFactorEnabled?:boolean;
    twoFactorOtp?:string;
    twoFactorOtpExpiry?:Date;
    blockUsers?:ObjectId[]
    blockedBy?:ObjectId[]
    
    

}

export interface IUser {
    _id: ObjectId;
}


export interface IPayload extends JwtPayload {
    _id: string;
    role: string;
}


declare module "jsonwebtoken" {
    interface JwtPayload {
        _id: string;
        role: string;
    }
}



declare module "express" {
    interface Request {
        user: IUser & Document
    }
}

export interface IReaction {
    reaction: REACTION;
    userId: ObjectId;

}

export interface Ipost {
    _id: ObjectId;
    userId: ObjectId;
    content: string;
    Reactions: IReaction[];
    attachments?: Iattachment[];
    isFreeze?:Boolean;
    mentions?: ObjectId[];

}

export interface IComment {
    _id: ObjectId;
    userId: ObjectId;
    postId: ObjectId;
    parentId: ObjectId | null;
    content: string;
    attachment: Iattachment;
    Reactions: IReaction[];
    mentions?: ObjectId[];
     isFreeze?:Boolean

}

export interface IMesage {
    content: string,
    sender: ObjectId,
    attachments?: Iattachment[];
    Reactions?: IReaction[]
}

export interface IChat {
    users: ObjectId[];
    messages: ObjectId[]
}



export interface IFriendRequest{
    from:ObjectId,
    to:ObjectId,
    status:FriendRequestStatus,
    createdAt:Date,
    UpdatedAt:Date
}
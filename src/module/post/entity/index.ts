import { ObjectId } from "mongoose";
import { Iattachment, IReaction } from "../../../utilis";

export class Post{
    userId:ObjectId;
    content:string;
    Reactions:IReaction[];
    attachments?:Iattachment[];
}
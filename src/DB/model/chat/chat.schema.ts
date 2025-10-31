import { Schema } from "mongoose";
import { IChat } from "../../../utilis";

export const ChatSchema = new Schema<IChat>({
   
    users:[{type:Schema.Types.ObjectId, ref:"User"}],
    messages:[{type:Schema.Types.ObjectId, ref:"Message"}],
}, { timestamps: true })
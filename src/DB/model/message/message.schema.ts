import { Schema } from "mongoose";
import { IMesage } from "../../../utilis";

export const messageSchema = new Schema<IMesage>({
    content: String,
    sender: { type: Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })
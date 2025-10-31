import { Schema } from "mongoose";
import { REACTION } from "../../../utilis";

export const reactionSchema = new Schema({
    reaction: {
        type: Number, enum: REACTION, set: (value) => Number(value)
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true })


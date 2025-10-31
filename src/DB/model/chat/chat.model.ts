import { model } from "mongoose";
import { ChatSchema } from "./chat.schema";

export const Chat = model("Chat",ChatSchema)
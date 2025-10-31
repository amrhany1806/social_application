import { model } from "mongoose";
import { IUser } from "../../../utilis/common/interface";
import { userSchema } from "./user.schema";

export const User = model<IUser>("User", userSchema);
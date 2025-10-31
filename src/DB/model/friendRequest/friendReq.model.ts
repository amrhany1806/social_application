import { model } from "mongoose";
import { IFriendRequest } from "../../../utilis";
import { friendRequestSchema } from "./friendReq.schema";

export const friendRequest = model<IFriendRequest>("friendRequest", friendRequestSchema)
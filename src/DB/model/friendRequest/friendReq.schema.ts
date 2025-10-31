import { Schema } from "mongoose";
import { IFriendRequest } from "../../../utilis/common/interface/index";
import { FriendRequestStatus } from "../../../utilis";

export const friendRequestSchema = new Schema<IFriendRequest>({
    from:{type:Schema.Types.ObjectId, ref:"User", required:true},
    to:{type:Schema.Types.ObjectId, ref:"User", required:true},
    status:{type:String, enum:Object.values(FriendRequestStatus), default:FriendRequestStatus.pending}
    
})
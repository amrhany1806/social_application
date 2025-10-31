import { ObjectId } from "mongoose";
import { Iattachment, IReaction } from "../../../utilis";

export class Comment {
        userId: ObjectId;
        postId: ObjectId;
        parentId: ObjectId | null;
        content: string;
        attachment: Iattachment;
        reactions: IReaction[];
        mentions?: ObjectId[]
}
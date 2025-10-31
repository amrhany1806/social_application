import { Schema } from "mongoose";
import { Ipost } from "../../../utilis";
import { reactionSchema } from "../common";
import { Comment } from "../comment/comment.model";



export const postSchema = new Schema<Ipost>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
   

    content: {
        type: String,
        // required:function () {
        //     if (this.attachments.length) {
        //         return false;
        //     }
        //     return true;
        // },
        trim: true
    },

    isFreeze: {
        type: Boolean,
        default: false
    },

 mentions: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

    Reactions: [reactionSchema],





}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

postSchema.virtual("comments", {
    localField: "_id",
    foreignField: "postId",
    ref: "Comment",
});

postSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {}

    // const firstLayer = await Comment.find({ postId: filter._id, parentId: null });

    // if (firstLayer.length) {
    //     for (const comment of firstLayer) {
    //         await Comment.deleteOne({ _id: comment._id })
    //     }
    // }
    // next()

    await Comment.deleteMany({ postId: filter._id })
})
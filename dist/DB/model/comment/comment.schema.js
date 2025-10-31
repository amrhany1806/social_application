"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = void 0;
const mongoose_1 = require("mongoose");
const reaction_schema_1 = require("./../common/reaction.schema");
exports.CommentSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    parentId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment"
        }],
    content: {
        type: String
    },
    isFreeze: {
        type: Boolean,
        default: false
    },
    Reactions: [reaction_schema_1.reactionSchema],
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
exports.CommentSchema.virtual("replies", {
    ref: "Comment",
    localField: "_id",
    foreignField: "parentId"
});
exports.CommentSchema.pre("deleteOne", async function (next) {
    const filter = typeof this.getFilter == "function" ? this.getFilter() : {};
    const replies = await this.model.find({ parentId: filter._id });
    if (replies.length) {
        for (const reply of replies) {
            await this.model.deleteOne({ _id: reply._id });
        }
    }
    next();
});

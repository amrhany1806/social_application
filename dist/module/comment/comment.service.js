"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_Repository_1 = require("./../../DB/model/post/post.Repository");
const utilis_1 = require("../../utilis");
const comment_repository_1 = require("./../../DB/model/comment/comment.repository");
const factory_1 = require("./factory");
const react_provider_1 = require("../../utilis/common/providers/react.provider");
class CommentService {
    PostRepository = new post_Repository_1.PostRepository;
    CommentRepositroy = new comment_repository_1.CommentRepositroy;
    commentFactory = new factory_1.CommentFactory();
    createComment = async (req, res) => {
        try {
            const { postId, id } = req.params;
            const createCommentDTO = req.body;
            const postExist = await this.PostRepository.exist({ _id: postId });
            if (!postExist) {
                throw new utilis_1.NotFoundError("post not found");
            }
            let commentExist = undefined;
            if (id) {
                commentExist = await this.CommentRepositroy.exist({ _id: id });
                if (!commentExist) {
                    throw new utilis_1.NotFoundError("comment not found");
                }
            }
            const comment = this.commentFactory.createNewComment(createCommentDTO, req.user, postExist, commentExist);
            const CreatedComment = await this.CommentRepositroy.create(comment);
            return res.status(201).json({ message: "done", success: true, data: { CreatedComment } });
        }
        catch (error) {
            return res.status(500).json({ message: "server error", error: error.message });
        }
    };
    getSpecific = async (req, res) => {
        const { id } = req.params;
        const commentExist = await this.CommentRepositroy.exist({ _id: id }, {}, { populate: [{ path: "replies" }] });
        if (!commentExist) {
            throw new utilis_1.NotFoundError("comment not found");
        }
        return res.status(200).json({ message: "comment fetched successfully", success: true, data: { commentExist } });
    };
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const commentExist = await this.CommentRepositroy.exist({ _id: id }, {}, { populate: [{ path: "postId", select: "userId" }] });
        if (!commentExist) {
            throw new utilis_1.NotFoundError("comment not found");
        }
        if (commentExist.userId.toString() != req.user.id && commentExist.postId.userId.toString()) {
            throw new utilis_1.NotAuthorizedError("sorry you are not the owner");
        }
        await this.CommentRepositroy.delete({ _id: id });
        return res.status(200).json({ message: "comment deleted successfully", success: true });
    };
    addReaction = async (req, res) => {
        try {
            const { id } = req.params;
            const { reaction } = req.body;
            await (0, react_provider_1.addReactionProvider)(this.CommentRepositroy, id, req.user.id, reaction);
            return res.sendStatus(204);
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };
    FreezeComment = async (req, res) => {
        const { CommentId } = req.params;
        const user = req.user;
        const CommentExist = await this.CommentRepositroy.exist({ _id: CommentId, isFreeze: false });
        if (!CommentExist) {
            throw new utilis_1.NotFoundError("comment not found");
        }
        const post = await this.PostRepository.exist({ _id: CommentExist.postId, isFreeze: false });
        if (!post) {
            throw new utilis_1.NotFoundError("post is frozen");
        }
        if (CommentExist.parentId) {
            const parentComment = await this.CommentRepositroy.exist({ _id: CommentExist.parentId });
            if (parentComment?.isFreeze) {
                throw new utilis_1.NotFoundError("parent comment is frozen");
            }
        }
        const comment = CommentExist.userId.toString() !== user?.id?.toString();
        const postExist = post.userId.toString() !== user?.id?.toString();
        if (comment && postExist) {
            throw new utilis_1.ForbiddenError("you are not auth to freeze this comment");
        }
        await this.CommentRepositroy.update({ _id: CommentId }, { isFreeze: true });
        return res.status(200).json({ message: "comment frozen successfully", success: true });
    };
    UnFreezeComment = async (req, res) => {
        const { CommentId } = req.params;
        const user = req.user;
        const CommentExist = await this.CommentRepositroy.exist({ _id: CommentId, isFreeze: true });
        if (!CommentExist) {
            throw new utilis_1.NotFoundError("comment not found");
        }
        const post = await this.PostRepository.exist({ _id: CommentExist.postId, isFreeze: false });
        if (!post) {
            throw new utilis_1.NotFoundError("post is frozen");
        }
        if (CommentExist.parentId) {
            const parentComment = await this.CommentRepositroy.exist({ _id: CommentExist.parentId });
            if (parentComment?.isFreeze) {
                throw new utilis_1.NotFoundError("parent comment is frozen");
            }
        }
        const comment = CommentExist.userId.toString() !== user?.id?.toString();
        const postExist = post.userId.toString() !== user?.id?.toString();
        if (comment && postExist) {
            throw new utilis_1.ForbiddenError("you are not auth to freeze this comment");
        }
        await this.CommentRepositroy.update({ _id: CommentId }, { isFreeze: false });
        return res.status(200).json({ message: "comment unfrozen successfully", success: true });
    };
    UpdateComment = async (req, res) => {
        const { CommentId } = req.params;
        const { content } = req.body;
        const user = req.user;
        const CommetnExist = await this.CommentRepositroy.exist({ _id: CommentId, isFreeze: false });
        if (!CommetnExist) {
            throw new utilis_1.NotFoundError("Comment Not Found");
        }
        if (CommetnExist.userId.toString() !== user.id.toString()) {
            throw new utilis_1.ForbiddenError("you are not the owner");
        }
        const post = await this.PostRepository.exist({ _id: CommetnExist.postId, isFreeze: false });
        if (!post) {
            throw new utilis_1.NotFoundError("post not found");
        }
        if (CommetnExist.parentId) {
            const parentComment = await this.CommentRepositroy.exist({ _id: CommetnExist.parentId });
            if (parentComment?.isFreeze) {
                throw new utilis_1.NotFoundError("parent comment not found or frozen");
            }
        }
        await this.CommentRepositroy.update({ _id: CommentId }, { content });
        return res.status(200).json({ message: "comment updated successfully", success: true });
    };
}
exports.default = new CommentService();

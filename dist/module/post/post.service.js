"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./factory/index");
const DB_1 = require("./../../DB");
const utilis_1 = require("../../utilis");
const react_provider_1 = require("../../utilis/common/providers/react.provider");
const User_Repository_1 = __importDefault(require("../../DB/model/user/User.Repository"));
const email_1 = require("../../utilis/email");
class PostService {
    postFactoryService = new index_1.PostFactoryService();
    PostRepository = new DB_1.PostRepository();
    UserRepository = new User_Repository_1.default();
    create = async (req, res, next) => {
        const createPostDto = req.body;
        const user = req.user;
        const validMentionsUsers = [];
        if (createPostDto.mentions.length) {
            for (const userId of createPostDto.mentions) {
                const mentionedUser = await this.UserRepository.exist({ _id: userId });
                if (!mentionedUser) {
                    throw new utilis_1.NotFoundError("there are invalid userId");
                }
                validMentionsUsers.push(mentionedUser._id.toString());
                await (0, email_1.Tags)({
                    to: mentionedUser.email,
                    from: user.email,
                    subject: "MentionNotifacation",
                    html: `<h1>${user.firstName} ${user.lastName} mentioned you in post</h1>`,
                });
            }
        }
        const post = this.postFactoryService.createPost(createPostDto, req.user);
        const createdPost = await this.PostRepository.create(post);
        return res.status(201).json({ message: "post created successfully", success: true, data: { createdPost } });
    };
    Addreaction = async (req, res, next) => {
        const { id } = req.params;
        const { reaction } = req.body;
        const userId = req.user.id;
        await (0, react_provider_1.addReactionProvider)(this.PostRepository, id, userId, reaction);
        return res.sendStatus(204);
    };
    getSpecific = async (req, res, next) => {
        const { id } = req.params;
        const post = await this.PostRepository.getOne({ _id: id }, {}, {
            populate: [{ path: "userId", select: "fullName firstName lastName" }, { path: "Reactions.userId", select: "fullName firstName lastName" },
                { path: "comments", match: { parentId: null } }
            ]
        });
        if (!post) {
            throw new utilis_1.NotFoundError("post not found");
        }
        return res.status(200).json({ message: "done", success: true, data: { post } });
    };
    deletePost = async (req, res) => {
        const { id } = req.params;
        const postExist = await this.PostRepository.exist({ _id: id });
        if (!postExist) {
            throw new utilis_1.NotFoundError("post not found");
        }
        if (postExist.userId.toString() != req.user.id) {
            throw new utilis_1.NotAuthorizedError("sorry you're not the owner");
        }
        await this.PostRepository.delete({ _id: id });
        return res.status(200).json({ message: "post deleted successfully", success: true });
    };
    FreezePost = async (req, res) => {
        const { postId } = req.params;
        const user = req.user;
        const postExist = await this.PostRepository.exist({ _id: postId, isFreeze: false });
        if (!postExist) {
            throw new utilis_1.NotFoundError("post not found");
        }
        if (postExist.userId.toString() !== user?._id?.toString()) {
            throw new utilis_1.ForbiddenError("you are not the owner");
        }
        await this.PostRepository.update({ _id: postId }, { isFreeze: true });
        return res.status(200).json({ message: "post frozen successfully", success: true });
    };
    UnFreezePost = async (req, res) => {
        const { postId } = req.params;
        const user = req.user;
        const postExist = await this.PostRepository.exist({ _id: postId, isFreeze: true });
        if (!postExist) {
            throw new utilis_1.NotFoundError("post not even frozen");
        }
        if (postExist.userId.toString() !== user?._id?.toString()) {
            throw new utilis_1.ForbiddenError("you are not the owner");
        }
        await this.PostRepository.update({ _id: postId }, { isFreeze: false });
        return res.status(200).json({ message: "post Unfrozen successfully", success: true });
    };
    UpdatePost = async (req, res) => {
        const { postId } = req.params;
        const { content } = req.body;
        const user = req.user;
        const PostExist = await this.PostRepository.exist({ _id: postId });
        if (!PostExist) {
            throw new utilis_1.NotFoundError("post not found");
        }
        if (PostExist.userId.toString() !== user?._id?.toString()) {
            throw new utilis_1.ForbiddenError("you are not the owner");
        }
        await this.PostRepository.update({ _id: postId }, { content });
        return res.status(200).json({ message: "post updated successfully", success: true });
    };
}
exports.default = new PostService();

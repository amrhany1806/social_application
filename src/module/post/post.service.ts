import { NextFunction, Request, Response } from "express"
import { CreatePostDto } from "./post.DTO"
import { PostFactoryService } from './factory/index';
import { PostRepository } from './../../DB';
import { ForbiddenError, NotAuthorizedError, NotFoundError, REACTION } from "../../utilis";
import { addReactionProvider } from "../../utilis/common/providers/react.provider";
import UserRepository from "../../DB/model/user/User.Repository";
import { Tags } from "../../utilis/email";

class PostService {
    private readonly postFactoryService = new PostFactoryService();
    private readonly PostRepository = new PostRepository();
    private readonly UserRepository = new UserRepository();

    public create = async (req: Request, res: Response, next: NextFunction) => {


            const createPostDto: CreatePostDto = req.body;

        const user = req.user

        const validMentionsUsers: String[] = []

        if (createPostDto.mentions.length) {
            for (const userId of createPostDto.mentions) {
                const mentionedUser = await this.UserRepository.exist({ _id: userId })
                if (!mentionedUser) {
                    throw new NotFoundError("there are invalid userId")
                }
                validMentionsUsers.push(mentionedUser._id.toString())

                await Tags({
                    to: mentionedUser.email,
                    from: user.email,
                    subject: "MentionNotifacation",
                    html: `<h1>${user.firstName} ${user.lastName} mentioned you in post</h1>`,

                });
            }

        }

        const post = this.postFactoryService.createPost(createPostDto, req.user);

        const createdPost = await this.PostRepository.create(post);

        return res.status(201).json({ message: "post created successfully", success: true, data: { createdPost } })

} 

    public Addreaction = async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { reaction } = req.body
        const userId = req.user.id;


        await addReactionProvider(this.PostRepository, id, userId, reaction)
        return res.sendStatus(204);
    }

    public getSpecific = async (req: Request, res: Response, next: NextFunction) => {

        const { id } = req.params;

        const post = await this.PostRepository.getOne({ _id: id }, {}, {
            populate: [{ path: "userId", select: "fullName firstName lastName" }, { path: "Reactions.userId", select: "fullName firstName lastName" }
                , { path: "comments", match: { parentId: null } }
            ]
        })

        if (!post) {
            throw new NotFoundError("post not found")
        }

        return res.status(200).json({ message: "done", success: true, data: { post } })

    }

    public deletePost = async (req: Request, res: Response) => {

        const { id } = req.params;

        const postExist = await this.PostRepository.exist({ _id: id })

        if (!postExist) {
            throw new NotFoundError("post not found")
        }

        if (postExist.userId.toString() != req.user.id) {
            throw new NotAuthorizedError("sorry you're not the owner")
        }
        await this.PostRepository.delete({ _id: id })

        return res.status(200).json({ message: "post deleted successfully", success: true })

    }

    public FreezePost = async (req: Request, res: Response) => {

        const { postId } = req.params;
        const user = req.user;

        const postExist = await this.PostRepository.exist({ _id: postId, isFreeze: false });
        if (!postExist) {
            throw new NotFoundError("post not found")
        }

        if (postExist.userId.toString() !== user?._id?.toString()) {
            throw new ForbiddenError("you are not the owner")
        }

        await this.PostRepository.update({ _id: postId }, { isFreeze: true })

        return res.status(200).json({ message: "post frozen successfully", success: true })
    }


    public UnFreezePost = async (req: Request, res: Response) => {

        const { postId } = req.params;
        const user = req.user;

        const postExist = await this.PostRepository.exist({ _id: postId, isFreeze: true });
        if (!postExist) {
            throw new NotFoundError("post not even frozen")
        }

        if (postExist.userId.toString() !== user?._id?.toString()) {
            throw new ForbiddenError("you are not the owner")
        }

        await this.PostRepository.update({ _id: postId }, { isFreeze: false })

        return res.status(200).json({ message: "post Unfrozen successfully", success: true })
    }

    public UpdatePost = async (req: Request, res: Response) => {

        const { postId } = req.params;

        const { content } = req.body;

        const user = req.user;

        const PostExist = await this.PostRepository.exist({ _id: postId });

        if (!PostExist) {
            throw new NotFoundError("post not found")
        }

        if (PostExist.userId.toString() !== user?._id?.toString()) {
            throw new ForbiddenError("you are not the owner")
        }

        await this.PostRepository.update({ _id: postId }, { content })


        return res.status(200).json({ message: "post updated successfully", success: true })
    }
}
export default new PostService();

import { Request, Response } from "express";
import { PostRepository } from './../../DB/model/post/post.Repository';
import { ForbiddenError, IComment, Ipost, NotAuthorizedError, NotFoundError } from "../../utilis";
import { CommentRepositroy } from './../../DB/model/comment/comment.repository';
import { CommentFactory } from "./factory";
import { CreateCommentDto } from "./comment.dto";
import { addReactionProvider } from "../../utilis/common/providers/react.provider";
import { throws } from "assert";

class CommentService {
    private readonly PostRepository = new PostRepository;
    private readonly CommentRepositroy = new CommentRepositroy;
    private readonly commentFactory = new CommentFactory();

    public createComment = async (req: Request, res: Response) => {

        try {
            const { postId, id } = req.params;

            const createCommentDTO: CreateCommentDto = req.body;

            const postExist = await this.PostRepository.exist({ _id: postId })

            if (!postExist) {
                throw new NotFoundError("post not found");
            }
            let commentExist: IComment | any = undefined;

            if (id) {
                commentExist = await this.CommentRepositroy.exist({ _id: id })

                if (!commentExist) {
                    throw new NotFoundError("comment not found");
                }
            }


            const comment = this.commentFactory.createNewComment(createCommentDTO, req.user, postExist, commentExist)

            const CreatedComment = await this.CommentRepositroy.create(comment)

            return res.status(201).json({ message: "done", success: true, data: { CreatedComment } })
        } catch (error) {
            return res.status(500).json({ message: "server error", error: error.message })
        }
    }


    public getSpecific = async (req: Request, res: Response) => {

        const { id } = req.params;

        const commentExist = await this.CommentRepositroy.exist({ _id: id }, {}, { populate: [{ path: "replies" }] });
        if (!commentExist) {
            throw new NotFoundError("comment not found")
        }

        return res.status(200).json({ message: "comment fetched successfully", success: true, data: { commentExist } })


    }


    public deleteComment = async (req: Request, res: Response) => {

        const { id } = req.params;

        const commentExist = await this.CommentRepositroy.exist({ _id: id }, {}, { populate: [{ path: "postId", select: "userId" }] })

        if (!commentExist) {
            throw new NotFoundError("comment not found")
        }

        if (commentExist.userId.toString() != req.user.id && (commentExist.postId as unknown as Ipost).userId.toString()) {
            throw new NotAuthorizedError("sorry you are not the owner")
        }

        await this.CommentRepositroy.delete({ _id: id })

        return res.status(200).json({ message: "comment deleted successfully", success: true })


    }

    public addReaction = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { reaction } = req.body;

            await addReactionProvider(this.CommentRepositroy, id, req.user.id, reaction)

            return res.sendStatus(204)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }


    public FreezeComment = async (req: Request, res: Response) => {

        const { CommentId } = req.params

        const user = req.user;

        const CommentExist = await this.CommentRepositroy.exist({ _id: CommentId, isFreeze: false })

        if (!CommentExist) {
            throw new NotFoundError("comment not found")
        }

        const post = await this.PostRepository.exist({ _id: CommentExist.postId, isFreeze: false })

        if (!post) {
            throw new NotFoundError("post is frozen")
        }

        if (CommentExist.parentId) {
            const parentComment = await this.CommentRepositroy.exist({ _id: CommentExist.parentId })
            if (parentComment?.isFreeze) {
                throw new NotFoundError("parent comment is frozen")
            }
        }

        const comment = CommentExist.userId.toString() !== user?.id?.toString()
        const postExist = post.userId.toString() !== user?.id?.toString()

        if (comment && postExist) {
            throw new ForbiddenError("you are not auth to freeze this comment")
        }

        await this.CommentRepositroy.update({ _id: CommentId }, { isFreeze: true })

        return res.status(200).json({ message: "comment frozen successfully", success: true })


    }


    public UnFreezeComment = async (req: Request, res: Response) => {

        const { CommentId } = req.params

        const user = req.user;

        const CommentExist = await this.CommentRepositroy.exist({ _id: CommentId, isFreeze: true })

        if (!CommentExist) {
            throw new NotFoundError("comment not found")
        }
        const post = await this.PostRepository.exist({ _id: CommentExist.postId, isFreeze: false })

        if (!post) {
            throw new NotFoundError("post is frozen")
        }

        if (CommentExist.parentId) {
            const parentComment = await this.CommentRepositroy.exist({ _id: CommentExist.parentId })
            if (parentComment?.isFreeze) {
                throw new NotFoundError("parent comment is frozen")
            }
        }

        const comment = CommentExist.userId.toString() !== user?.id?.toString()
        const postExist = post.userId.toString() !== user?.id?.toString()

        if (comment && postExist) {
            throw new ForbiddenError("you are not auth to freeze this comment")
        }

        await this.CommentRepositroy.update({ _id: CommentId }, { isFreeze: false })

        return res.status(200).json({ message: "comment unfrozen successfully", success: true })


    }

    public UpdateComment = async (req: Request, res: Response) => {

        const { CommentId } = req.params;
        const { content } = req.body;
        const user = req.user;

        const CommetnExist = await this.CommentRepositroy.exist({ _id: CommentId , isFreeze:false})

        if (!CommetnExist) {
            throw new NotFoundError("Comment Not Found")
        }

        if (CommetnExist.userId.toString() !== user.id.toString()) {
            throw new ForbiddenError("you are not the owner")
        }

        const post = await this.PostRepository.exist({_id:CommetnExist.postId, isFreeze:false})

        if (!post) {
            throw new NotFoundError("post not found")
        }

        if (CommetnExist.parentId) {
            const parentComment = await this.CommentRepositroy.exist({_id:CommetnExist.parentId})
            
                    if (parentComment?.isFreeze) {
                        throw new NotFoundError("parent comment not found or frozen")
                    }
        }

        await this.CommentRepositroy.update({ _id: CommentId }, { content })

        return res.status(200).json({ message: "comment updated successfully", success: true })

    }
}

export default new CommentService();
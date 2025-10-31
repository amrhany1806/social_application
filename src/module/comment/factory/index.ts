import { IComment, Ipost, IUser } from '../../../utilis';
import { Comment } from '../entity';
import { CreateCommentDto } from './../comment.dto';

export class CommentFactory {

    createNewComment(CreateCommentDto: CreateCommentDto, user: IUser, post: Ipost, comment?: IComment) {

        const newComment = new Comment();
        newComment.content = CreateCommentDto.content;
        newComment.userId = user._id;
        newComment.postId = post._id || comment.postId;
        newComment.parentId = comment?._id;
        newComment.reactions = [];


        return newComment
    }
}
import { Post } from '../entity';
import { CreatePostDto } from './../post.DTO';
import { IUser } from './../../../utilis/common/interface/index';
export class PostFactoryService {

    createPost(createPostDto: CreatePostDto, user: IUser) {
        const newPost = new Post();

        newPost.content = createPostDto.content;
        newPost.userId = user._id;
        newPost.Reactions = [];
        newPost.attachments = [];

        return newPost;
    }
    updatePost() {

    }

}
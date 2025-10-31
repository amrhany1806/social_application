"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostFactoryService = void 0;
const entity_1 = require("../entity");
class PostFactoryService {
    createPost(createPostDto, user) {
        const newPost = new entity_1.Post();
        newPost.content = createPostDto.content;
        newPost.userId = user._id;
        newPost.Reactions = [];
        newPost.attachments = [];
        return newPost;
    }
    updatePost() {
    }
}
exports.PostFactoryService = PostFactoryService;

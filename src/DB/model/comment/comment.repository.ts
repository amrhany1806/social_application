import { IComment } from "../../../utilis";
import { AbstractRepository } from "../../abstract.repository";
import { Comment } from "./comment.model";

export class CommentRepositroy extends AbstractRepository<IComment>{
constructor(){
    super(Comment)
}


}
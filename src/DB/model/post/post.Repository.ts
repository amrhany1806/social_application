import { AbstractRepository } from "../../abstract.repository";
import { Ipost } from "../../../utilis";
import { Post } from "./post.model";

export class PostRepository extends AbstractRepository<Ipost>{
  
    constructor(){
        super(Post)
    }

}

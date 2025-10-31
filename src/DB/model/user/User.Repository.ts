import { RootFilterQuery } from "mongoose";
import { IUser } from "../../../utilis/common/interface";
import { AbstractRepository } from "../../abstract.repository";
import { User } from "./user.model";


export default class UserRepository extends AbstractRepository<IUser> {
    constructor() {
        super(User);
    }

  async getSpecificUser(filter:RootFilterQuery<IUser>){
        return await this.model.findOne(filter);
    }
}
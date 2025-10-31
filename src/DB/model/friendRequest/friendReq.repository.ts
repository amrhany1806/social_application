import { IFriendRequest } from "../../../utilis";
import { AbstractRepository } from "../../abstract.repository";
import { friendRequest } from "./friendReq.model";

export class friendReqRepository extends AbstractRepository<IFriendRequest> {
    constructor() {
        super(friendRequest);
    }
}
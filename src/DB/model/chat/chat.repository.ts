import { AbstractRepository } from "../../abstract.repository";
import { Chat } from "./chat.model";
import { IChat } from './../../../utilis/common/interface/index';

export class ChatRepository extends AbstractRepository<IChat> {
    constructor() {
        super(Chat);
    }
}
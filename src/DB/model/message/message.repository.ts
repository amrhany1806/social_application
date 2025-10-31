import { IMesage } from "../../../utilis";
import { AbstractRepository } from "../../abstract.repository";
import { Message } from "./message.model";

export class MessageRepository extends AbstractRepository<IMesage> {
    constructor() {
        super(Message);
    }
}
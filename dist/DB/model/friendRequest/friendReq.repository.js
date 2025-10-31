"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendReqRepository = void 0;
const abstract_repository_1 = require("../../abstract.repository");
const friendReq_model_1 = require("./friendReq.model");
class friendReqRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(friendReq_model_1.friendRequest);
    }
}
exports.friendReqRepository = friendReqRepository;

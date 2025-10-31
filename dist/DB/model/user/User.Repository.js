"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_repository_1 = require("../../abstract.repository");
const user_model_1 = require("./user.model");
class UserRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async getSpecificUser(filter) {
        return await this.model.findOne(filter);
    }
}
exports.default = UserRepository;

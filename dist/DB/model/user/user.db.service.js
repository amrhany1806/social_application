"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_repository_1 = require("../../abstract.repository");
const user_model_1 = require("./user.model");
class UserRepository extends abstract_repository_1.AbstractRepository {
    constructor() {
        super(user_model_1.User);
    }
    async getAllUsers() {
        return await this.model.find();
    }
}
exports.default = UserRepository;

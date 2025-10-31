"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReactionProvider = void 0;
const error_1 = require("../../error");
const enum_1 = require("../enum");
const addReactionProvider = async (repo, id, userId, reaction) => {
    const postExist = await repo.exist({ _id: id, isFreeze: false });
    if (!postExist) {
        throw new error_1.NotFoundError("not found");
    }
    let UserReacted = postExist.Reactions.findIndex((reaction) => {
        return reaction.userId.toString() == userId;
    });
    if (UserReacted == -1) {
        await repo.update({ _id: id }, { $push: { Reactions: { reaction: [null, undefined, ""].includes(reaction) ? enum_1.REACTION.LIKE : reaction, userId } } });
    }
    else if ([undefined, null, ""].includes(reaction)) {
        await repo.update({ _id: id }, { $pull: { Reactions: postExist.Reactions[UserReacted] } });
    }
    else {
        await repo.update({ _id: id, "Reactions.userId": userId }, {
            "Reactions.$.reaction": reaction
        });
    }
};
exports.addReactionProvider = addReactionProvider;

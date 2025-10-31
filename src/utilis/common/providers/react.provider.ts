import { CommentRepositroy, PostRepository } from "../../../DB";
import { BadRequestError, NotFoundError } from "../../error";
import { REACTION } from "../enum";

export const addReactionProvider = async (repo: CommentRepositroy | PostRepository, id: string, userId: string, reaction: string) => {


    const postExist = await repo.exist({ _id: id, isFreeze: false });
    if (!postExist) {
        throw new NotFoundError("not found")
    }


    let UserReacted = postExist.Reactions.findIndex((reaction) => {
        return reaction.userId.toString() == userId;
    });

    if (UserReacted == -1) {
        await repo.update({ _id: id }, { $push: { Reactions: { reaction: [null, undefined, ""].includes(reaction) ? REACTION.LIKE : reaction, userId } } })

    } else if ([undefined, null, ""].includes(reaction)) {
        await repo.update({ _id: id }, { $pull: { Reactions: postExist.Reactions[UserReacted] } })
    }
    else {
        await repo.update({ _id: id, "Reactions.userId": userId }, {
            "Reactions.$.reaction": reaction
        })
    }
}
import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware";
import commentService from "./comment.service";

const router = Router({ mergeParams: true });

router.post("{/:id}", isAuthenticated(), commentService.createComment)

router.get("/:id", isAuthenticated(), commentService.getSpecific)

router.delete("/:id", isAuthenticated(), commentService.deleteComment)

router.patch("/:id", isAuthenticated(), commentService.addReaction)

router.patch("/:CommentId/freeze", isAuthenticated(), commentService.FreezeComment)

router.patch("/:CommentId/unfreeze", isAuthenticated(), commentService.UnFreezeComment)

router.patch("/update/:CommentId", isAuthenticated(), commentService.UpdateComment)


export default router;
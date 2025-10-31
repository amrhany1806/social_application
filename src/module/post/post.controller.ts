import { Router } from "express";
import postService from "./post.service";
import { isAuthenticated } from "../../middleware/auth.middleware";
import { commentRouter } from "..";

const router = Router();

router.use("/:postId/comment", commentRouter);
router.post("/", isAuthenticated(), postService.create);
router.patch("/:id", isAuthenticated(), postService.Addreaction);
router.get("/:id", isAuthenticated(), postService.getSpecific);
router.delete("/:id", isAuthenticated(), postService.deletePost);
router.patch("/:postId/frezze", isAuthenticated(), postService.FreezePost);
router.patch("/:postId/unfrezze", isAuthenticated(), postService.UnFreezePost);
router.patch("/:postId/update", isAuthenticated(), postService.UpdatePost);
export default router;
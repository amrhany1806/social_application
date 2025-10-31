"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_service_1 = __importDefault(require("./post.service"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const __1 = require("..");
const router = (0, express_1.Router)();
router.use("/:postId/comment", __1.commentRouter);
router.post("/", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.create);
router.patch("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.Addreaction);
router.get("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.getSpecific);
router.delete("/:id", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.deletePost);
router.patch("/:postId/frezze", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.FreezePost);
router.patch("/:postId/unfrezze", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.UnFreezePost);
router.patch("/:postId/update", (0, auth_middleware_1.isAuthenticated)(), post_service_1.default.UpdatePost);
exports.default = router;

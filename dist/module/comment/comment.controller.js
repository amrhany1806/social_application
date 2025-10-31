"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const comment_service_1 = __importDefault(require("./comment.service"));
const router = (0, express_1.Router)({ mergeParams: true });
router.post("{/:id}", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.createComment);
router.get("/:id", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.getSpecific);
router.delete("/:id", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.deleteComment);
router.patch("/:id", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.addReaction);
router.patch("/:CommentId/freeze", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.FreezeComment);
router.patch("/:CommentId/unfreeze", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.UnFreezeComment);
router.patch("/update/:CommentId", (0, auth_middleware_1.isAuthenticated)(), comment_service_1.default.UpdateComment);
exports.default = router;

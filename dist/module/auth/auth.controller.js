"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_service_1 = __importDefault(require("./auth.service"));
const token_1 = require("../../utilis/token");
const router = (0, express_1.Router)();
router.post("/register", auth_service_1.default.register);
router.post("/verify", auth_service_1.default.verfiyAccount);
router.post("/login", auth_service_1.default.login);
router.patch("/confirm-login", auth_service_1.default.confirmLogin);
router.post("/refreshToken", token_1.refreshAccessToken);
exports.default = router;

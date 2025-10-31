"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_service_1 = __importDefault(require("./user.service"));
const auth_middleware_1 = require("../../middleware/auth.middleware");
const validators = __importStar(require("./user.validation"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const router = (0, express_1.Router)();
router.get("/profile", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.getProfile);
router.patch("/update-basic", (0, auth_middleware_1.isAuthenticated)(), (0, validation_middleware_1.isValid)(validators.updateBasicInfo), user_service_1.default.updateBasicInfo);
router.patch("/update-pass", (0, auth_middleware_1.isAuthenticated)(), (0, validation_middleware_1.isValid)(validators.UpdatePassword), user_service_1.default.updatePassword);
router.patch("/update-email", (0, auth_middleware_1.isAuthenticated)(), (0, validation_middleware_1.isValid)(validators.updateEmail), user_service_1.default.updateEmail);
router.patch("/confirm-email", (0, auth_middleware_1.isAuthenticated)(), (0, validation_middleware_1.isValid)(validators.confrimEmail), user_service_1.default.confirmEmail);
router.post("/enable2Fa", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.enable2FA);
router.patch("/verfiy2Fa", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.Verfiy2FA);
router.post("/sendFriendReq/:reciptionId", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.SendFriendReq);
router.patch("/AcceptFriendReq/:requestId", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.AcceptFriendReq);
router.delete("/deleteFriendReq/:friendReqId", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.deleteFriendReq);
router.patch("/unfriend/:friendId", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.Unfriend);
router.patch("/blockUser/:BlockUserId", (0, auth_middleware_1.isAuthenticated)(), user_service_1.default.BlockUser);
exports.default = router;

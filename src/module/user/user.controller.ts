import { Router } from "express";
import UserService from "./user.service";
import { isAuthenticated } from "../../middleware/auth.middleware";
import * as validators from "./user.validation"
import { isValid } from "../../middleware/validation.middleware";
const router = Router();

router.get("/profile", isAuthenticated(), UserService.getProfile)
router.patch("/update-basic", isAuthenticated(), isValid(validators.updateBasicInfo), UserService.updateBasicInfo)
router.patch("/update-pass", isAuthenticated(), isValid(validators.UpdatePassword), UserService.updatePassword)
router.patch("/update-email", isAuthenticated(), isValid(validators.updateEmail), UserService.updateEmail)
router.patch("/confirm-email", isAuthenticated(), isValid(validators.confrimEmail), UserService.confirmEmail)
router.post("/enable2Fa", isAuthenticated(), UserService.enable2FA)
router.patch("/verfiy2Fa", isAuthenticated(), UserService.Verfiy2FA)
router.post("/sendFriendReq/:reciptionId", isAuthenticated(), UserService.SendFriendReq)
router.patch("/AcceptFriendReq/:requestId", isAuthenticated(), UserService.AcceptFriendReq)
router.delete("/deleteFriendReq/:friendReqId", isAuthenticated(), UserService.deleteFriendReq)
router.patch("/unfriend/:friendId", isAuthenticated(), UserService.Unfriend)
router.patch("/blockUser/:BlockUserId", isAuthenticated(), UserService.BlockUser)



export default router;

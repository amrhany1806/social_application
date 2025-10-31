import { Router } from "express";
import AuthService from "./auth.service";
import { refreshAccessToken } from "../../utilis/token";

const router = Router();

router.post("/register", AuthService.register);
router.post("/verify",  AuthService.verfiyAccount);
router.post("/login", AuthService.login);
router.patch("/confirm-login", AuthService.confirmLogin)
router.post("/refreshToken", refreshAccessToken)

export default router;
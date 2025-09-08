import {Router} from "express";
import {signup, login, me} from "../controllers/authController";
import {authMiddleware} from "../middleware/auth";
import {zodValidate} from "../middleware/zodValidate";
import { signupSchema, loginSchema } from "../utils/validators";

const router = Router();

router.post("/signup", zodValidate(signupSchema), signup);
router.post("/login", zodValidate(loginSchema), login);
router.get("/me", authMiddleware, me)

export default router;
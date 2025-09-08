import {Router} from "express";
import {signup, login, me} from "../controllers/authController";
import {authMiddleware} from "../middleware/auth";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me)

export default router;
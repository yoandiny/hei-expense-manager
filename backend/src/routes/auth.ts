import {Router} from "express";
import {signup, login, me} from "../controllers/authController.js";
import {authMiddleware} from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me)

export default router;
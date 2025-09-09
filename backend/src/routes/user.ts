import {Router} from "express";
import {authMiddleware} from "../middleware/auth.js";
import {getProfile, updateProfile} from "../controllers/userController.js";

const router = Router()

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile)

export default router;
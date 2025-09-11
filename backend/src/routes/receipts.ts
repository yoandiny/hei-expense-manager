import { Router } from "express";
import { uploadReceipt, downloadReceipt, viewReceipt } from "../controllers/receiptController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// ✅ Applique authMiddleware uniquement à l'upload (POST)
router.post("/:id/upload", authMiddleware, upload.single("receipt"), uploadReceipt);

// ❌ Pas d'authMiddleware sur view/download — on gère l'auth dans le contrôleur via le token en query
router.get("/:id/download", downloadReceipt);
router.get("/:id/view", viewReceipt);

export default router;
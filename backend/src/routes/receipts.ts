import { Router } from "express";
import { uploadReceipt, downloadReceipt, viewReceipt } from "../controllers/receiptController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.use(authMiddleware);

// POST /api/receipts/:id/upload → upload un reçu pour une dépense
router.post("/:id/upload", upload.single("receipt"), uploadReceipt);

// GET /api/receipts/:id/download → télécharge le reçu
router.get("/:id/download", downloadReceipt);

// GET /api/receipts/:id/view → affiche le reçu dans le navigateur
router.get("/:id/view", viewReceipt);

export default router;
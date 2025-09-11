import { Router } from "express";
import { uploadReceipt, downloadReceipt, viewReceipt } from "../controllers/receiptController";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();


router.post("/:id/upload", authMiddleware, upload.single("receipt"), uploadReceipt);

router.get("/:id/download", downloadReceipt);
router.get("/:id/view", viewReceipt);

export default router;
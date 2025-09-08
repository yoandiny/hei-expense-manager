import { Router } from "express";
import { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome } from "../controllers/incomeController";
import{ authMiddleware} from "../middleware/auth"; 

const router = Router();

router.use(authMiddleware);


router.post("/",authMiddleware, createIncome);

router.get("/",authMiddleware, getIncomes);


router.get("/:id",authMiddleware, getIncomeById);


router.put("/:id",authMiddleware, updateIncome);

router.delete("/:id",authMiddleware, deleteIncome);

export default router;

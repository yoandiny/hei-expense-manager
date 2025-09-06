import { Router } from "express";
import { createIncome, getIncomes, getIncomeById, updateIncome, deleteIncome } from "../controllers/incomeController";
import auth from "../middleware/auth"; 

const router = Router();

router.use(auth);


router.post("/", createIncome);

router.get("/", getIncomes);


router.get("/:id", getIncomeById);


router.put("/:id", updateIncome);

router.delete("/:id", deleteIncome);

export default router;

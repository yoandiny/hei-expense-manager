import { Router } from "express";


import { createExpense, getExpenses, updateExpense, deleteExpense } from "../controllers/expenseController";


import { authenticate } from "../middleware/auth";

const router = Router(); 

router.use(authenticate);

router.post("/", createExpense);

router.get("/", getExpenses);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

// On exporte le router pour l’utiliser dans index.export default router;

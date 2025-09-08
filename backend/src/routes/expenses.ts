import express from "express";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";

//import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/", createExpense);

router.get("/", getExpenses);

router.get("/:id", getExpenseById);

router.put("/:id", updateExpense);

router.delete("/:id", deleteExpense);

export default router;

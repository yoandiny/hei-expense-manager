import express from "express";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";

import { authenticate } from "../middleware/auth";

const router = express.Router();

router.post("/", authenticate, createExpense);

router.get("/", authenticate, getExpenses);

router.get("/:id", authenticate, getExpenseById);

router.put("/:id", authenticate, updateExpense);

router.delete("/:id", authenticate, deleteExpense);

export default router;

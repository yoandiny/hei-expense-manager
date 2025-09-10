import express from "express";

import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController";

import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/",authMiddleware, createExpense);

router.get("/",authMiddleware, getExpenses);

router.get("/:id",authMiddleware, getExpenseById);

router.put("/:id",authMiddleware, updateExpense);

router.delete("/:id",authMiddleware, deleteExpense);

export default router;

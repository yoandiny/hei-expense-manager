import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, type, date, categoryId, description, startDate, endDate } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (type === "ONE_TIME" && !date) {
      return res.status(400).json({ error: "Date is required for a one-time expense" });
    }

    if (type === "RECURRING" && !startDate) {
      return res.status(400).json({ error: "Start date is required for a recurring expense" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        type,
        date: type === "ONE_TIME" ? new Date(date) : null,
        startDate: type === "RECURRING" ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        categoryId: parseInt(categoryId, 10),
        description,
        userId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("❌ Error in createExpense:", error);
    res.status(500).json({ error: "Failed to create expense" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  try {
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true },
    });

    res.json(expenses);
  } catch (error) {
    console.error("❌ Error in getExpenses:", error);
    res.status(500).json({ error: "Failed to fetch expenses" });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: parseInt(id, 10), userId },
      include: { category: true },
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(expense);
  } catch (error) {
    console.error("❌ Error in getExpenseById:", error);
    res.status(500).json({ error: "Failed to fetch expense" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, type, date, categoryId, description, startDate, endDate } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const existing = await prisma.expense.findFirst({
      where: { id: parseInt(id, 10), userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Expense not found" });
    }

    let updateData: any = {
      amount: amount ? parseFloat(amount) : existing.amount,
      categoryId: categoryId ? parseInt(categoryId, 10) : existing.categoryId,
      description: description ?? existing.description,
      type,
    };

    if (type === "ONE_TIME") {
      if (!date) {
        return res.status(400).json({ error: "Date is required for a one-time expense" });
      }
      updateData.date = new Date(date);
      updateData.startDate = null;
      updateData.endDate = null;
    }

    if (type === "RECURRING") {
      if (!startDate) {
        return res.status(400).json({ error: "Start date is required for a recurring expense" });
      }
      updateData.date = null;
      updateData.startDate = new Date(startDate);
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(id, 10) },
      data: updateData,
    });

    res.json(expense);
  } catch (error) {
    console.error("❌ Error in updateExpense:", error);
    res.status(500).json({ error: "Failed to update expense" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const existing = await prisma.expense.findFirst({
      where: { id: parseInt(id, 10), userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await prisma.expense.delete({ where: { id: parseInt(id, 10) } });

    res.json({ message: "✅ Expense deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteExpense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
};
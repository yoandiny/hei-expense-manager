import { Request, Response } from "express";
import prisma from "../PrismaClient";

export const createIncome = async (req: Request, res: Response) => {
  try {
    const { amount, date, source, description } = req.body;

    if (!amount || !date || !source) {
      return res.status(400).json({ error: "Amount, date, and source are required" });
    }

    const income = await prisma.income.create({
      data: {
        amount,
        date: new Date(date),
        source,
        description,
        userId: (req as any).user.id,
      },
    });

    res.status(201).json(income);
  } catch (error) {
    console.error("❌ Error creating income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getIncomes = async (req: Request, res: Response) => {
  try {
    const incomes = await prisma.income.findMany({
      where: { userId: (req as any).user.id},
      orderBy: { date: "desc" },
    });

    res.json(incomes);
  } catch (error) {
    console.error("❌ Error fetching incomes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getIncomeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const income = await prisma.income.findFirst({
      where: { id: Number(id), userId: (req as any).user.id},
    });

    if (!income) {
      return res.status(404).json({ error: "Income not found" });
    }

    res.json(income);
  } catch (error) {
    console.error("❌ Error fetching income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, date, source, description } = req.body;

    const income = await prisma.income.updateMany({
      where: { id: Number(id), userId: (req as any).user.id},
      data: { amount, date: date ? new Date(date) : undefined, source, description },
    });

    if (income.count === 0) {
      return res.status(404).json({ error: "Income not found" });
    }

    res.json({ message: "Income updated successfully" });
  } catch (error) {
    console.error("❌ Error updating income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const income = await prisma.income.deleteMany({
      where: { id: Number(id), userId: (req as any).user.id},
    });

    if (income.count === 0) {
      return res.status(404).json({ error: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

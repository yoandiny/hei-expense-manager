import { Request, Response } from "express";
import prisma from "../PrismaClient";

export const createIncome = async (req: Request, res: Response) => {
  try {
    const { amount, date, source, description } = req.body;
    const userId =(req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (!amount || !date || !source) {
      return res.status(400).json({ error: "Amount, date, and source are required" });
    }

    const income = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        source,
        description,
        userId,
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
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const incomes = await prisma.income.findMany({
      where: { userId },
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
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const income = await prisma.income.findFirst({
      where: { id: Number(id), userId },
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
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const income = await prisma.income.update({
      where: { id: Number(id), userId },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        source: source || undefined,
        description: description || undefined,
      },
    });

    res.json(income);
  } catch (error) {
    console.error("❌ Error updating income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const income = await prisma.income.delete({
      where: { id: Number(id), userId },
    });

    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting income:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
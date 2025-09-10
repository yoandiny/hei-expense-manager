import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, type, date, categoryId, description, startDate, endDate } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    if (type === "ONE_TIME" && !date) {
      return res.status(400).json({ error: "Date est obligatoire pour une dépense ponctuelle" });
    }

    if (type === "RECURRING" && !startDate) {
      return res.status(400).json({ error: "StartDate est obligatoire pour une dépense récurrente" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        type, // "ONE_TIME" ou "RECURRING"
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
    console.error("❌ Erreur createExpense:", error);
    res.status(500).json({ error: "Erreur lors de la création de la dépense" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  try {
    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true },
    });

    res.json(expenses);
  } catch (error) {
    console.error("❌ Erreur getExpenses:", error);
    res.status(500).json({ error: "Erreur lors de la récupération des dépenses" });
  }
};

export const getExpenseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const expense = await prisma.expense.findFirst({
      where: { id: parseInt(id, 10), userId },
      include: { category: true },
    });

    if (!expense) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    res.json(expense);
  } catch (error) {
    console.error("❌ Erreur getExpenseById:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de la dépense" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, type, date, categoryId, description, startDate, endDate } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const existing = await prisma.expense.findFirst({
      where: { id: parseInt(id, 10), userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    let updateData: any = {
      amount: amount ? parseFloat(amount) : existing.amount,
      categoryId: categoryId ? parseInt(categoryId, 10) : existing.categoryId,
      description: description ?? existing.description,
      type,
    };

    if (type === "ONE_TIME") {
      if (!date) {
        return res.status(400).json({ error: "Date requise pour une dépense ponctuelle" });
      }
      updateData.date = new Date(date);
      updateData.startDate = null;
      updateData.endDate = null;
    }

    if (type === "RECURRING") {
      if (!startDate) {
        return res.status(400).json({ error: "StartDate requis pour une dépense récurrente" });
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
    console.error("❌ Erreur updateExpense:", error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la dépense" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const existing = await prisma.expense.findFirst({
      where: { id: parseInt(id, 10), userId },
    });

    if (!existing) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    await prisma.expense.delete({ where: { id: parseInt(id, 10) } });

    res.json({ message: "✅ Dépense supprimée avec succès" });
  } catch (error) {
    console.error("❌ Erreur deleteExpense:", error);
    res.status(500).json({ error: "Erreur lors de la suppression de la dépense" });
  }
};

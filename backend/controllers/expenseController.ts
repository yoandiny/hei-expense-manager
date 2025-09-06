import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createExpense = async (req, res) => {
  try {
    const { amount, type, date, categoryId, description, startDate, endDate } = req.body;
    const userId = req.user.id;

    if (type === "One-time" && !date) {
      return res.status(400).json({ error: "Date est obligatoire pour une dépense ponctuelle" });
    }

    if (type === "Recurring" && !startDate) {
      return res.status(400).json({ error: "StartDate est obligatoire pour une dépense récurrente" });
    }

    const expense = await prisma.expense.create({
      data: {
        amount: parseFloat(amount),
        type,
        date: type === "One-time" ? new Date(date) : null,
        categoryId: parseInt(categoryId),
        description,
        startDate: type === "Recurring" ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de la dépense" });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await prisma.expense.findMany({
      where: { userId },
      include: { category: true, receipts: true },
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des dépenses" });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const expense = await prisma.expense.findFirst({
      where: { id: parseInt(id), userId },
      include: { category: true, receipts: true },
    });

    if (!expense) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération de la dépense" });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type, date, categoryId, description, startDate, endDate } = req.body;
    const userId = req.user.id;

    const existing = await prisma.expense.findFirst({ where: { id: parseInt(id), userId } });
    if (!existing) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    let updateData: any = {
      amount: amount ? parseFloat(amount) : existing.amount,
      categoryId: categoryId ? parseInt(categoryId) : existing.categoryId,
      description,
      type,
    };

    if (type === "One-time") {
      if (!date) return res.status(400).json({ error: "Date requise pour One-time" });
      updateData.date = new Date(date);
      updateData.startDate = null;
      updateData.endDate = null;
    }

    if (type === "Recurring") {
      if (!startDate) return res.status(400).json({ error: "StartDate requis pour Recurring" });
      updateData.date = null;
      updateData.startDate = new Date(startDate);
      updateData.endDate = endDate ? new Date(endDate) : null;
    }

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la dépense" });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await prisma.expense.findFirst({ where: { id: parseInt(id), userId } });
    if (!existing) {
      return res.status(404).json({ error: "Dépense non trouvée" });
    }

    await prisma.expense.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Dépense supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de la dépense" });
  }
};

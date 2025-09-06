import { Request, Response } from "express"; 

import prisma from "../prismaClient"; 

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { amount, date, categoryId, description, type, startDate, endDate } = req.body;

    const expense = await prisma.expense.create({
      data: {
        amount,
        date: new Date(date),
        description,
        type,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: req.user.id, 
        categoryId
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création de la dépense" });
  }
};

export const getExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { userId: req.user.id },
      include: { category: true },
      orderBy: { date: "desc" },
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des dépenses" });
  }
};

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, date, description, type, startDate, endDate, categoryId } = req.body;

    const expense = await prisma.expense.update({
      where: { id: Number(id) },
      data: {
        amount,
        date: new Date(date),
        description,
        type,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        categoryId,
      },
    });

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la mise à jour de la dépense" });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la suppression de la dépense" });
  }
};

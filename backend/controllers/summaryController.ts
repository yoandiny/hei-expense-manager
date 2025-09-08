import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSummary = async (req: Request, res: Response) => {
    try {
        const userId = 1; // À remplacer par req.user.id
        const { startDate, endDate } = req.query; // Filtres optionnels

        const expenseFilter: any = { userId };
        const incomeFilter: any = { userId };

        if (startDate && endDate) {
            expenseFilter.date = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
            incomeFilter.date = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
        }

        const totalExpenses = await prisma.expense.aggregate({
            where: expenseFilter,
            _sum: { amount: true },
        });
        const totalIncomes = await prisma.income.aggregate({
            where: incomeFilter,
            _sum: { amount: true },
        });

        res.status(200).json({
            totalExpenses: totalExpenses._sum.amount || 0,
            totalIncomes: totalIncomes._sum.amount || 0,
            balance: (totalIncomes._sum.amount || 0) - (totalExpenses._sum.amount || 0),
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
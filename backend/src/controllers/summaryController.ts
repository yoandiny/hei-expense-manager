import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSummary = async (req: Request, res: Response) => {
    try {
        const userId = 1; // plus tard remplacé par req.user.id
        const { startDate, endDate } = req.query;

        const expenseFilter: any = { userId };
        if (startDate && endDate) {
            expenseFilter.date = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
        }

        // total des dépenses
        const totalExpenses = await prisma.expense.aggregate({
            where: expenseFilter,
            _sum: { amount: true },
        });

        // nombre de catégories utilisées par cet utilisateur
        const categoryCount = await prisma.category.count({
            where: { userId },
        });

        // dépenses groupées par catégorie
        const expensesByCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: expenseFilter,
            _sum: { amount: true },
        });

        // récupérer les noms des catégories correspondantes
        const categories = await prisma.category.findMany({
            where: { id: { in: expensesByCategory.map(e => e.categoryId) } },
        });

        // fusionner les infos id + nom + total
        const expensesWithCategory = expensesByCategory.map(e => ({
            categoryId: e.categoryId,
            categoryName: categories.find(c => c.id === e.categoryId)?.name || 'Inconnu',
            total: e._sum.amount || 0,
        }));

        res.status(200).json({
            totalExpenses: totalExpenses._sum.amount || 0,
            categoryCount,
            expensesByCategory: expensesWithCategory,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};


export const getMonthlySummary = async (req: Request, res: Response) => {
    try {
        const userId = 1; // À remplacer par req.user.id
        const { month } = req.query;
        const date = month ? new Date(month as string) : new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const expenseFilter: any = { userId, date: { gte: startDate, lte: endDate } };
        const incomeFilter: any = { userId, date: { gte: startDate, lte: endDate } };

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

export const getBudgetAlerts = async (req: Request, res: Response) => {
    try {
        const userId = 1; // À remplacer par req.user.id
        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const expenseFilter: any = { userId, date: { gte: startDate, lte: endDate } };
        const incomeFilter: any = { userId, date: { gte: startDate, lte: endDate } };

        const totalExpenses = await prisma.expense.aggregate({
            where: expenseFilter,
            _sum: { amount: true },
        });
        const totalIncomes = await prisma.income.aggregate({
            where: incomeFilter,
            _sum: { amount: true },
        });

        const totalExpensesAmount = totalExpenses._sum.amount || 0;
        const totalIncomesAmount = totalIncomes._sum.amount || 0;
        const alert = totalExpensesAmount > totalIncomesAmount;

        res.status(200).json({
            alert,
            message: alert
                ? `Vous avez dépassé votre budget ce mois-ci de $${(totalExpensesAmount - totalIncomesAmount).toFixed(2)}`
                : 'Votre budget est respecté ce mois-ci',
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
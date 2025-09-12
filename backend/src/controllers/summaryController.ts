import { Request, Response } from 'express';
import prisma from '../PrismaClient';
import { getBudgetAlert } from '../services/budgetAlertService';

interface ExpensesByCategory {
    categoryId: number;
    categoryName: string;
    total: number;
}

interface SummaryResponse {
    totalExpenses: number;
    categoryCount: number;
    expensesByCategory: ExpensesByCategory[];
    lastUpdated: string;
}

interface MonthlySummaryResponse {
    totalExpenses: number;
    totalIncomes: number;
    balance: number;
    categoryCount: number;
}

interface BudgetAlertResponse {
    alert: boolean;
    message: string;
}

export const getSummary = async (req: Request, res: Response<SummaryResponse | { error: string }>) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Utilisateur non authentifié' });
        const userId = user.id;

        const { startDate, endDate } = req.query;
        const expenseFilter: any = { userId };

        if (startDate && endDate) {
            expenseFilter.date = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
        }

        const totalExpenses = await prisma.expense.aggregate({
            where: expenseFilter,
            _sum: { amount: true },
        });

        const expensesByCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: expenseFilter,
            _sum: { amount: true },
        });

        const categories = await prisma.category.findMany({
            where: { id: { in: expensesByCategory.map(e => e.categoryId) } },
        });

        const expensesWithCategory: ExpensesByCategory[] = expensesByCategory.map(e => ({
            categoryId: e.categoryId,
            categoryName: categories.find(c => c.id === e.categoryId)?.name || 'Inconnu',
            total: e._sum.amount || 0,
        }));

        const categoryCount = expensesByCategory.length;

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

export const getMonthlySummary = async (req: Request, res: Response<MonthlySummaryResponse | { error: string }>) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Utilisateur non authentifié' });
        const userId = user.id;

        const month = req.query.month as string | undefined;
        const date = month ? new Date(month) : new Date();
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const expenseFilter = { userId, date: { gte: startDate, lte: endDate } };
        const incomeFilter = { userId, date: { gte: startDate, lte: endDate } };

        const totalExpenses = await prisma.expense.aggregate({
            where: expenseFilter,
            _sum: { amount: true },
        });

        const totalIncomes = await prisma.income.aggregate({
            where: incomeFilter,
            _sum: { amount: true },
        });

        const expensesByCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: expenseFilter,
            _sum: { amount: true },
        });

        const categoryCount = expensesByCategory.length;

        res.status(200).json({
            totalExpenses: totalExpenses._sum.amount || 0,
            totalIncomes: totalIncomes._sum.amount || 0,
            balance: (totalIncomes._sum.amount || 0) - (totalExpenses._sum.amount || 0),
            categoryCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getBudgetAlerts = async (req: Request, res: Response<BudgetAlertResponse | { error: string }>) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Utilisateur non authentifié' });
        const userId = user.id;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;

        const alertData = await getBudgetAlert(userId, year, month);

        res.status(200).json({
            alert: alertData.isOverBudget,
            message: alertData.isOverBudget
                ? `Vous avez dépassé votre budget ce mois-ci de ${alertData.overAmount.toFixed(2)} €`
                : 'Votre budget est respecté ce mois-ci',
        });
    } catch (error) {
        console.error("Erreur dans getBudgetAlerts:", error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

export const getTotalIncome = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Utilisateur non authentifié' });
        const userId = user.id;

        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const totalIncomes = await prisma.income.aggregate({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            _sum: { amount: true },
        });

        res.status(200).json({
            totalIncome: totalIncomes._sum.amount || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
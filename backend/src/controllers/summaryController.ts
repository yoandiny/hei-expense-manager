import { Request, Response } from 'express';
import prisma from '../PrismaClient'; // Assure-toi que tu as exporté PrismaClient depuis ce fichier

// ------------------- Typages -------------------
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

// ------------------- getSummary -------------------
export const getSummary = async (req: Request, res: Response<SummaryResponse | { error: string }>) => {
    try {
        // 🔹 Récupérer l'utilisateur connecté depuis req.user (à configurer avec ton auth middleware)
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Utilisateur non authentifié' });
        const userId = user.id;

        const { startDate, endDate } = req.query;
        const expenseFilter: any = { userId };

        if (startDate && endDate) {
            expenseFilter.date = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
        }

        // Total des dépenses
        const totalExpenses = await prisma.expense.aggregate({
            where: expenseFilter,
            _sum: { amount: true },
        });

        // Dépenses groupées par catégorie
        const expensesByCategory = await prisma.expense.groupBy({
            by: ['categoryId'],
            where: expenseFilter,
            _sum: { amount: true },
        });

        // Récupérer les noms des catégories
        const categories = await prisma.category.findMany({
            where: { id: { in: expensesByCategory.map(e => e.categoryId) } },
        });

        // Fusionner id + nom + total
        const expensesWithCategory: ExpensesByCategory[] = expensesByCategory.map(e => ({
            categoryId: e.categoryId,
            categoryName: categories.find(c => c.id === e.categoryId)?.name || 'Inconnu',
            total: e._sum.amount || 0,
        }));

        // Nombre de catégories réellement utilisées
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

// ------------------- getMonthlySummary -------------------
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

        // Dépenses par catégorie
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

// ------------------- getBudgetAlerts -------------------
export const getBudgetAlerts = async (req: Request, res: Response<BudgetAlertResponse | { error: string }>) => {
    try {
        const user = req.user;
        if (!user) return res.status(401).json({ error: 'Utilisateur non authentifié' });
        const userId = user.id;

        const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

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
        console.error(error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

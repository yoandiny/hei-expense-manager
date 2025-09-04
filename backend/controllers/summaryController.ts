import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtenir un résumé des dépenses et revenus
export const getSummary = async (req: Request, res: Response) => {
    try {
        const userId = 1; // À remplacer par req.user.id
        // Calculer le total des dépenses
        const totalExpenses = await prisma.expense.aggregate({
            where: { userId },
            _sum: { amount: true },
        });
        // Calculer le total des revenus
        const totalIncomes = await prisma.income.aggregate({
            where: { userId },
            _sum: { amount: true },
        });
        // Réponse avec le résumé
        res.status(200).json({
            totalExpenses: totalExpenses._sum.amount || 0,
            totalIncomes: totalIncomes._sum.amount || 0,
            balance: (totalIncomes._sum.amount || 0) - (totalExpenses._sum.amount || 0),
        });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
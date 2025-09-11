import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getBudgetAlert = async (userId: number, year: number, month: number) => {
    // 🗓️ Début et fin du mois
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);

    // 💰 1. Somme des revenus du mois
    const incomes = await prisma.income.findMany({
        where: {
            userId,
            date: {
                gte: monthStart,
                lte: monthEnd,
            },
        },
    });

    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);

    // 🛒 2. Somme des dépenses ponctuelles du mois
    const oneTimeExpenses = await prisma.expense.findMany({
        where: {
            userId,
            type: "ONE_TIME",
            date: {
                gte: monthStart,
                lte: monthEnd,
            },
        },
    });

    // 🔄 3. Somme des dépenses récurrentes ACTIVES ce mois-ci
    const recurringExpenses = await prisma.expense.findMany({
        where: {
            userId,
            type: "RECURRING",
            startDate: { lte: monthEnd },
            OR: [
                { endDate: { gte: monthStart } },
                { endDate: null },
            ],
        },
    });

    const totalExpenses =
        oneTimeExpenses.reduce((sum, exp) => sum + exp.amount, 0) +
        recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    // ⚠️ 4. Calcul de l'alerte
    const isOverBudget = totalExpenses > totalIncome;
    const overAmount = isOverBudget ? totalExpenses - totalIncome : 0;

    return {
        totalIncome,
        totalExpenses,
        isOverBudget,
        overAmount,
        month: `${year}-${String(month).padStart(2, "0")}`,
    };
};
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getActiveRecurringExpenses = async (userId: number, year: number, month: number) => {
  // Premier jour du mois
  const startDate = new Date(year, month - 1, 1);
  // Dernier jour du mois
  const endDate = new Date(year, month, 0);

  // Requête Prisma : trouve les dépenses récurrentes actives ce mois-ci
  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      type: "RECURRING",
      startDate: { lte: endDate }, // La dépense a commencé AVANT ou PENDANT le mois
      OR: [
        { endDate: { gte: startDate } }, // La dépense se termine PENDANT ou APRÈS le mois
        { endDate: null }, // Pas de date de fin → toujours active
      ],
    },
  });

  return expenses;
};
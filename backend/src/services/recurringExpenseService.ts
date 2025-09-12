import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getActiveRecurringExpenses = async (userId: number, year: number, month: number) => {
  const startDate = new Date(year, month - 1, 1);

  const endDate = new Date(year, month, 0);

  const expenses = await prisma.expense.findMany({
    where: {
      userId,
      type: "RECURRING",
      startDate: { lte: endDate },
      OR: [
        { endDate: { gte: startDate } },
        { endDate: null },
      ],
    },
  });

  return expenses;
};
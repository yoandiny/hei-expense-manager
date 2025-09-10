/*
  Warnings:

  - You are about to drop the column `receiptUrl` on the `Expense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Expense" DROP COLUMN "receiptUrl",
ADD COLUMN     "receiptPath" TEXT;

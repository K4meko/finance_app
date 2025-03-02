/*
  Warnings:

  - You are about to drop the column `budgetId` on the `BudgetItem` table. All the data in the column will be lost.
  - You are about to drop the column `budget` on the `Month` table. All the data in the column will be lost.
  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `BudgetItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paycheck` to the `Month` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "BudgetItem" DROP CONSTRAINT "BudgetItem_budgetId_fkey";

-- DropForeignKey
ALTER TABLE "Month" DROP CONSTRAINT "Month_budgetId_fkey";

-- DropIndex
DROP INDEX "Month_userId_key";

-- AlterTable
ALTER TABLE "BudgetItem" DROP COLUMN "budgetId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Month" DROP COLUMN "budget",
ADD COLUMN     "paycheck" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "salaryAmount" DOUBLE PRECISION;

-- DropTable
DROP TABLE "Budget";

-- CreateTable
CREATE TABLE "MonthBudgetItem" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "MonthBudgetItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthBudgetItem" ADD CONSTRAINT "MonthBudgetItem_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `createdAt` on the `BudgetItem` table. All the data in the column will be lost.
  - You are about to drop the column `monthId` on the `BudgetItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `BudgetItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Month` table. All the data in the column will be lost.
  - The primary key for the `MonthlyExpense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `MonthlyExpense` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `MonthlyExpense` table. All the data in the column will be lost.
  - Made the column `paycheck` on table `Month` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BudgetItem" DROP CONSTRAINT "BudgetItem_monthId_fkey";

-- AlterTable
ALTER TABLE "BudgetItem" DROP COLUMN "createdAt",
DROP COLUMN "monthId",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Month" DROP COLUMN "updatedAt",
ALTER COLUMN "paycheck" SET NOT NULL,
ALTER COLUMN "paycheck" SET DEFAULT 0,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "timestamp" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "MonthlyExpense" DROP CONSTRAINT "MonthlyExpense_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MonthlyExpense_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MonthlyExpense_id_seq";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MonthBudgetItem" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "monthId" INTEGER NOT NULL,

    CONSTRAINT "MonthBudgetItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MonthBudgetItem" ADD CONSTRAINT "MonthBudgetItem_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

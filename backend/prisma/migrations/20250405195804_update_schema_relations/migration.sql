/*
  Warnings:

  - The primary key for the `MonthlyExpense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `MonthlyExpense` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MonthBudgetItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `BudgetItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Month` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `timestamp` on the `Month` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `updatedAt` to the `MonthlyExpense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MonthBudgetItem" DROP CONSTRAINT "MonthBudgetItem_monthId_fkey";

-- AlterTable
ALTER TABLE "BudgetItem" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "monthId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Month" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "paycheck" DROP NOT NULL,
DROP COLUMN "timestamp",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyExpense" DROP CONSTRAINT "MonthlyExpense_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "MonthlyExpense_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "hash" TEXT NOT NULL;

-- DropTable
DROP TABLE "MonthBudgetItem";

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE SET NULL ON UPDATE CASCADE;

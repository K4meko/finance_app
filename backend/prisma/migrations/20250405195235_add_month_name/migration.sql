/*
  Warnings:

  - You are about to drop the column `budgetId` on the `Month` table. All the data in the column will be lost.
  - The primary key for the `MonthlyExpense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `Month` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timestamp` to the `Month` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthId` to the `MonthlyExpense` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Month_budgetId_key";

-- AlterTable
ALTER TABLE "Month" DROP COLUMN "budgetId",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "salary" DOUBLE PRECISION,
ADD COLUMN     "timestamp" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyExpense" DROP CONSTRAINT "MonthlyExpense_pkey",
ADD COLUMN     "monthId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "MonthlyExpense_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "MonthlyExpense_id_seq";

-- AddForeignKey
ALTER TABLE "MonthlyExpense" ADD CONSTRAINT "MonthlyExpense_monthId_fkey" FOREIGN KEY ("monthId") REFERENCES "Month"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

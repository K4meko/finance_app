/*
  Warnings:

  - Added the required column `month` to the `Month` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Month" ADD COLUMN     "month" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "password" TEXT;

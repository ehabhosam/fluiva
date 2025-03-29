/*
  Warnings:

  - You are about to drop the `_CategoryToPlan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_id` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToPlan" DROP CONSTRAINT "_CategoryToPlan_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToPlan" DROP CONSTRAINT "_CategoryToPlan_B_fkey";

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "category_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password_hash" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "_CategoryToPlan";

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

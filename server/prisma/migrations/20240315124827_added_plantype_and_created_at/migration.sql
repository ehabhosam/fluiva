/*
  Warnings:

  - Added the required column `type` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('SWIFT', 'STANDARD', 'STRATEGIC');

-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "PlanType" NOT NULL;

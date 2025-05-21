-- CreateEnum
CREATE TYPE "TodoType" AS ENUM ('TASK', 'ROUTINE');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "type" "PlanType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "required_time" INTEGER NOT NULL,
    "priority" "Priority",
    "is_breakable" BOOLEAN NOT NULL DEFAULT true,
    "type" "TodoType" NOT NULL,
    "plan_id" INTEGER NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "plan_id" INTEGER NOT NULL,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Block" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "done_at" TIMESTAMP(3),
    "period_id" INTEGER NOT NULL,
    "todo_id" INTEGER NOT NULL,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "Period"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Block" ADD CONSTRAINT "Block_todo_id_fkey" FOREIGN KEY ("todo_id") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

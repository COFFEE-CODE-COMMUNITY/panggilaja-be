/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `order_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "order_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_order_id_key" ON "Review"("order_id");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

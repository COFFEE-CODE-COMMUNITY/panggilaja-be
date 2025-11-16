/*
  Warnings:

  - You are about to drop the column `user_id` on the `Review` table. All the data in the column will be lost.
  - Added the required column `buyer_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Review" DROP CONSTRAINT "Review_user_id_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "user_id",
ADD COLUMN     "buyer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "BuyerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

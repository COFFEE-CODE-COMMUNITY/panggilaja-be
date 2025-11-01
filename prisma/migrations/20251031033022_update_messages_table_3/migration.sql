/*
  Warnings:

  - You are about to drop the column `customer_id` on the `Message` table. All the data in the column will be lost.
  - Added the required column `buyer_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_customer_id_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "customer_id",
ADD COLUMN     "buyer_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_buyer_id_fkey" FOREIGN KEY ("buyer_id") REFERENCES "BuyerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

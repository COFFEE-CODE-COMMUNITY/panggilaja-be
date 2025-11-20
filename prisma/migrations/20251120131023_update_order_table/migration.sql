/*
  Warnings:

  - You are about to drop the column `is_confirmed` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "is_confirmed";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false;

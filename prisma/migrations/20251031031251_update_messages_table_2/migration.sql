/*
  Warnings:

  - You are about to drop the column `file_url` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sender_type` on the `Message` table. All the data in the column will be lost.
  - Made the column `customer_id` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seller_id` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "file_url",
DROP COLUMN "sender_type",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "customer_id" SET NOT NULL,
ALTER COLUMN "seller_id" SET NOT NULL;

-- DropEnum
DROP TYPE "public"."SenderType";

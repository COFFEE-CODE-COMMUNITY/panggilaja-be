/*
  Warnings:

  - Added the required column `sender_role` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SenderRole" AS ENUM ('BUYER', 'SELLER');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "sender_role" "SenderRole" NOT NULL;

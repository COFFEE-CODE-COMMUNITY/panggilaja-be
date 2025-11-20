/*
  Warnings:

  - You are about to drop the column `service_id` on the `Documentation` table. All the data in the column will be lost.
  - Made the column `seller_id` on table `Documentation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Documentation" DROP CONSTRAINT "Documentation_service_id_fkey";

-- AlterTable
ALTER TABLE "Documentation" DROP COLUMN "service_id",
ALTER COLUMN "seller_id" SET NOT NULL;

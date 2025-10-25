/*
  Warnings:

  - A unique constraint covering the columns `[seller_id]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Skill_seller_id_key" ON "Skill"("seller_id");

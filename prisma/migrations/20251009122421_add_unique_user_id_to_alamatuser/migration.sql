/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `AlamatUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AlamatUser_user_id_key" ON "AlamatUser"("user_id");

-- DropForeignKey
ALTER TABLE "public"."AlamatUser" DROP CONSTRAINT "AlamatUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Documentation" DROP CONSTRAINT "Documentation_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."FavoriteService" DROP CONSTRAINT "FavoriteService_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Service" DROP CONSTRAINT "Service_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Skill" DROP CONSTRAINT "Skill_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ulasan" DROP CONSTRAINT "Ulasan_seller_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Ulasan" DROP CONSTRAINT "Ulasan_user_id_fkey";

-- AlterTable
ALTER TABLE "Documentation" ALTER COLUMN "seller_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "seller_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Ulasan" ALTER COLUMN "seller_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AlamatUser" ADD CONSTRAINT "AlamatUser_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ulasan" ADD CONSTRAINT "Ulasan_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Documentation" ADD CONSTRAINT "Documentation_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteService" ADD CONSTRAINT "FavoriteService_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

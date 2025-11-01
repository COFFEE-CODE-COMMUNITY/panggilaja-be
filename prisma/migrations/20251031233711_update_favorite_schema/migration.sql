-- DropForeignKey
ALTER TABLE "public"."FavoriteService" DROP CONSTRAINT "FavoriteService_service_id_fkey";

-- AddForeignKey
ALTER TABLE "FavoriteService" ADD CONSTRAINT "FavoriteService_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

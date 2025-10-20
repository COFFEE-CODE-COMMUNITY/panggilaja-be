-- DropForeignKey
ALTER TABLE "public"."Skill" DROP CONSTRAINT "Skill_seller_id_fkey";

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('customer', 'seller');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT,
    "seller_id" TEXT,
    "sender_type" "SenderType" NOT NULL,
    "content" TEXT,
    "file_url" TEXT,
    "file_type" TEXT DEFAULT 'none',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "BuyerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "SellerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: Add SGD and USD price columns to product_variants
ALTER TABLE "product_catalog"."product_variants"
  ADD COLUMN "price_sgd" DECIMAL(12,2),
  ADD COLUMN "price_usd" DECIMAL(12,2);

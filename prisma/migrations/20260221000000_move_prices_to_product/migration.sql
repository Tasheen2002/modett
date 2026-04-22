-- Move price fields from product_variants to products

-- 1. Add price columns to products table
ALTER TABLE "product_catalog"."products"
  ADD COLUMN "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN "price_sgd" DECIMAL(12,2),
  ADD COLUMN "price_usd" DECIMAL(12,2),
  ADD COLUMN "compare_at_price" DECIMAL(12,2);

-- 2. Copy existing prices from first variant to product (data migration)
UPDATE "product_catalog"."products" p
SET
  "price" = COALESCE(
    (SELECT v."price" FROM "product_catalog"."product_variants" v
     WHERE v."product_id" = p."product_id"
     ORDER BY v."created_at" ASC LIMIT 1),
    0
  ),
  "price_sgd" = (
    SELECT v."price_sgd" FROM "product_catalog"."product_variants" v
    WHERE v."product_id" = p."product_id"
    ORDER BY v."created_at" ASC LIMIT 1
  ),
  "price_usd" = (
    SELECT v."price_usd" FROM "product_catalog"."product_variants" v
    WHERE v."product_id" = p."product_id"
    ORDER BY v."created_at" ASC LIMIT 1
  ),
  "compare_at_price" = (
    SELECT v."compare_at_price" FROM "product_catalog"."product_variants" v
    WHERE v."product_id" = p."product_id"
    ORDER BY v."created_at" ASC LIMIT 1
  );

-- 3. Remove price columns from product_variants table
ALTER TABLE "product_catalog"."product_variants"
  DROP COLUMN IF EXISTS "price",
  DROP COLUMN IF EXISTS "price_sgd",
  DROP COLUMN IF EXISTS "price_usd",
  DROP COLUMN IF EXISTS "compare_at_price";

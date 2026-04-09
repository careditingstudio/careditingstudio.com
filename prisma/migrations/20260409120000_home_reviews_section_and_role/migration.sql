-- AlterTable
ALTER TABLE "client_reviews" ADD COLUMN IF NOT EXISTS "role" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "home_reviews_eyebrow" TEXT NOT NULL DEFAULT '';
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "home_reviews_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "home_reviews_subtitle" TEXT NOT NULL DEFAULT '';

-- AlterTable (IF NOT EXISTS: safe if column was added manually or by a prior partial apply)
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "home_featured_portfolio_order_json" TEXT NOT NULL DEFAULT '[]';

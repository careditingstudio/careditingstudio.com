-- Home "Our Services Features" block (JSON in site_settings)
ALTER TABLE "site_settings"
  ADD COLUMN IF NOT EXISTS "home_service_features_json" TEXT NOT NULL DEFAULT '{}';

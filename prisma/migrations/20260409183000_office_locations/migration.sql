-- Office locations (JSON in site_settings)
ALTER TABLE "site_settings"
  ADD COLUMN IF NOT EXISTS "office_locations_json" TEXT NOT NULL DEFAULT '[]';


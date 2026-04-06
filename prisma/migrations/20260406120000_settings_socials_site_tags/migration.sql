-- Add socials + site tags to settings
ALTER TABLE "site_settings"
  ADD COLUMN IF NOT EXISTS "social_links_json" TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "site_tags_text" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "site_tags_separator" TEXT NOT NULL DEFAULT 'newline';


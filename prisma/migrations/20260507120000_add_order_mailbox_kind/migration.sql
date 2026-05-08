-- Add ORDER kind to MailboxKind enum (safe if already added).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MailboxKind') THEN
    BEGIN
      ALTER TYPE "MailboxKind" ADD VALUE IF NOT EXISTS 'ORDER';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END$$;


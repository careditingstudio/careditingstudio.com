-- CreateEnum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'MailboxKind') THEN
    CREATE TYPE "MailboxKind" AS ENUM ('CONTACT', 'FREE_TRIAL');
  END IF;
END$$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "mailbox_messages" (
  "id" SERIAL NOT NULL,
  "kind" "MailboxKind" NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "read_at" TIMESTAMP(3),
  "full_name" TEXT NOT NULL,
  "email" TEXT,
  "whatsapp" TEXT,
  "country" TEXT,
  "message" TEXT NOT NULL,
  "requirements" TEXT,
  "ip" TEXT,
  "user_agent" TEXT,
  CONSTRAINT "mailbox_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "mailbox_messages_kind_created_at_idx"
ON "mailbox_messages"("kind", "created_at" DESC);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "mailbox_messages_read_at_idx"
ON "mailbox_messages"("read_at");


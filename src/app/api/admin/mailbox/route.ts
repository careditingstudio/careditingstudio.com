import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminListMailboxMessages } from "@/lib/db/mailbox-repository";
import { isMailboxKind, type MailboxKind } from "@/lib/mailbox-types";

export const runtime = "nodejs";

function parseKind(v: string | null): MailboxKind | undefined {
  if (isMailboxKind(v)) return v;
  return undefined;
}

export async function GET(request: Request) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  const url = new URL(request.url);
  const kind = parseKind(url.searchParams.get("kind"));
  const q = url.searchParams.get("q") ?? "";
  const includeRead = url.searchParams.get("includeRead") === "1";
  const limitRaw = url.searchParams.get("limit");
  const cursorRaw = url.searchParams.get("cursorId");
  const limit = limitRaw ? Number(limitRaw) : undefined;
  const cursorId = cursorRaw ? Number(cursorRaw) : undefined;

  const rows = await adminListMailboxMessages({
    kind,
    q,
    includeRead,
    limit: Number.isFinite(limit) ? limit : undefined,
    cursorId: Number.isFinite(cursorId) ? cursorId : undefined,
  });

  return NextResponse.json({ items: rows });
}


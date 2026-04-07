import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api";
import { adminMarkMailboxRead } from "@/lib/db/mailbox-repository";

export const runtime = "nodejs";

export async function PATCH(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const deny = await requireAdminApi();
  if (deny) return deny;

  const { id } = await ctx.params;
  const n = Number(id);
  if (!Number.isFinite(n) || n <= 0) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as { read?: unknown };
  const read = Boolean(b.read);
  try {
    const updated = await adminMarkMailboxRead(n, read);
    return NextResponse.json({ ok: true, ...updated });
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}


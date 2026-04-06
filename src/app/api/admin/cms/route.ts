import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { normalizeCmsJson, type CmsJson } from "@/lib/cms-types";
import { readCms, writeCms } from "@/lib/cms-store";
import { requireAdminApi } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET() {
  const deny = await requireAdminApi();
  if (deny) return deny;
  return NextResponse.json(await readCms());
}

export async function PUT(request: Request) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const merged = normalizeCmsJson(body) as CmsJson;
  await writeCms(merged);
  revalidatePath("/");
  revalidatePath("/portfolio");

  return NextResponse.json(await readCms());
}

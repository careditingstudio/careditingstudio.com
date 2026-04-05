import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { normalizeCmsJson, type CmsJson } from "@/lib/cms-types";
import { readCms, writeCms } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(readCms());
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const merged = normalizeCmsJson(body) as CmsJson;
  writeCms(merged);
  revalidatePath("/");

  return NextResponse.json(readCms());
}

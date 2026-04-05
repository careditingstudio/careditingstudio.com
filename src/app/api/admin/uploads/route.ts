import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { CMS_UPLOAD_DIR } from "@/lib/cms-store";

export const runtime = "nodejs";

export async function GET() {
  try {
    const names = await fs.readdir(CMS_UPLOAD_DIR);
    const urls = names
      .filter((n) => n !== ".gitkeep" && !n.startsWith("."))
      .sort((a, b) => b.localeCompare(a))
      .map((n) => `/cms/uploads/${n}`);
    return NextResponse.json({ files: urls });
  } catch {
    return NextResponse.json({ files: [] as string[] });
  }
}

export async function DELETE(request: Request) {
  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const url = body.url?.trim() ?? "";
  if (!url.startsWith("/cms/uploads/") || url.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const name = path.basename(url);
  const disk = path.join(CMS_UPLOAD_DIR, name);
  const resolved = path.resolve(disk);
  const root = path.resolve(CMS_UPLOAD_DIR);
  if (!resolved.startsWith(root)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    await fs.unlink(resolved);
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

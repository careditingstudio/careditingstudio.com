import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { ensureUploadDir, CMS_UPLOAD_DIR } from "@/lib/cms-store";

export const runtime = "nodejs";

const ALLOWED = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const EXT_SET = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif"]);

function extFromFileName(name: string): string | null {
  const n = name.toLowerCase();
  const dot = n.lastIndexOf(".");
  if (dot < 0) return null;
  const e = n.slice(dot + 1);
  return EXT_SET.has(e) ? (e === "jpeg" ? "jpg" : e) : null;
}

function extFrom(file: File): string {
  const fromName = extFromFileName(file.name);
  if (fromName) return fromName;
  const t = file.type;
  if (t === "image/jpeg" || t === "image/jpg") return "jpg";
  if (t === "image/png") return "png";
  if (t === "image/webp") return "webp";
  if (t === "image/gif") return "gif";
  if (t === "image/avif") return "avif";
  return "webp";
}

/** Many Windows browsers send an empty `File.type` even for valid images. */
function isAllowedImage(file: File): boolean {
  if (ALLOWED.has(file.type)) return true;
  if (file.type !== "" && file.type !== "application/octet-stream") return false;
  return extFromFileName(file.name) !== null;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form" }, { status: 400 });
  }

  const file = form.get("file");
  if (!file || !(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (!isAllowedImage(file)) {
    return NextResponse.json(
      { error: "Unsupported type — use JPG, PNG, WebP, GIF, or AVIF" },
      { status: 400 },
    );
  }

  const max = 12 * 1024 * 1024;
  if (file.size > max) {
    return NextResponse.json({ error: "Max file size 12MB" }, { status: 400 });
  }

  ensureUploadDir();
  const ext = extFrom(file);
  const name = `${randomUUID()}.${ext}`;
  const diskPath = path.join(CMS_UPLOAD_DIR, name);
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(diskPath, buf);

  const publicUrl = `/cms/uploads/${name}`;
  return NextResponse.json({ url: publicUrl });
}

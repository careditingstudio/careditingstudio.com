import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary-server";
import { requireAdminApi } from "@/lib/admin-api";

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

function isAllowedImage(file: File): boolean {
  if (ALLOWED.has(file.type)) return true;
  if (file.type !== "" && file.type !== "application/octet-stream") return false;
  return extFromFileName(file.name) !== null;
}

export async function POST(request: Request) {
  const deny = await requireAdminApi();
  if (deny) return deny;
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

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const { secureUrl } = await uploadImageBuffer(buf);
    return NextResponse.json({ url: secureUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

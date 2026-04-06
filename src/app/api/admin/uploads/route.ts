import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  destroyBySecureUrl,
  listUploadedImageUrls,
} from "@/lib/cloudinary-server";

export const runtime = "nodejs";

/** Legacy on-disk uploads (pre–Cloudinary). */
const CMS_UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "cms",
  "uploads",
);

function hasCloudinaryEnv() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim(),
  );
}

export async function GET() {
  if (hasCloudinaryEnv()) {
    try {
      const cloud = await listUploadedImageUrls();
      return NextResponse.json({ files: cloud });
    } catch {
      return NextResponse.json({ files: [] as string[] });
    }
  }

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

  if (hasCloudinaryEnv() && url.includes("res.cloudinary.com")) {
    try {
      await destroyBySecureUrl(url);
      revalidatePath("/");
      return NextResponse.json({ ok: true });
    } catch {
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
  }

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

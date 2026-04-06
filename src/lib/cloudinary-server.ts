import "server-only";

import { v2 as cloudinary } from "cloudinary";

function ensureConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET",
    );
  }
  cloudinary.config({ cloud_name, api_key, api_secret });
}

export function getCloudinaryUploadFolder(): string {
  return (
    process.env.CLOUDINARY_UPLOAD_FOLDER?.trim() || "careditingstudio-cms"
  );
}

export async function uploadImageBuffer(
  buffer: Buffer,
): Promise<{ secureUrl: string; publicId: string }> {
  ensureConfig();
  const folder = getCloudinaryUploadFolder();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (err, result) => {
        if (err || !result?.secure_url || !result.public_id) {
          reject(err ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );
    stream.end(buffer);
  });
}

export async function listUploadedImageUrls(): Promise<string[]> {
  ensureConfig();
  const folder = getCloudinaryUploadFolder();
  const out: string[] = [];
  let nextCursor: string | undefined;
  do {
    const res = (await cloudinary.api.resources({
      type: "upload",
      resource_type: "image",
      prefix: folder,
      max_results: 100,
      direction: "desc",
      ...(nextCursor ? { next_cursor: nextCursor } : {}),
    })) as {
      resources: { secure_url: string }[];
      next_cursor?: string;
    };
    for (const r of res.resources) {
      if (r.secure_url) out.push(r.secure_url);
    }
    nextCursor = res.next_cursor;
  } while (nextCursor);
  return out;
}

/** Extract Cloudinary public_id from a secure URL (for delete). */
export function publicIdFromSecureUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("res.cloudinary.com")) return null;
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx < 0) return null;
    let i = uploadIdx + 1;
    if (parts[i]?.match(/^v\d+$/)) i++;
    const rest = parts.slice(i).join("/");
    if (!rest) return null;
    return rest.replace(/\.[a-zA-Z0-9]+$/, "");
  } catch {
    return null;
  }
}

export async function destroyBySecureUrl(url: string): Promise<void> {
  ensureConfig();
  const publicId = publicIdFromSecureUrl(url);
  if (!publicId) {
    throw new Error("Not a Cloudinary URL");
  }
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

import fs from "fs";
import path from "path";
import {
  type CmsJson,
  defaultCmsJson,
  normalizeCmsJson,
} from "@/lib/cms-types";

const DATA_DIR = path.join(process.cwd(), "data");
const CMS_FILE = path.join(DATA_DIR, "cms.json");

export function readCms(): CmsJson {
  try {
    const raw = fs.readFileSync(CMS_FILE, "utf-8");
    return normalizeCmsJson(JSON.parse(raw));
  } catch {
    return defaultCmsJson();
  }
}

export function writeCms(data: CmsJson) {
  const next: CmsJson = {
    ...normalizeCmsJson(data),
    updatedAt: new Date().toISOString(),
  };
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(CMS_FILE, `${JSON.stringify(next, null, 2)}\n`, "utf-8");
  return next;
}

export const CMS_UPLOAD_DIR = path.join(process.cwd(), "public", "cms", "uploads");

export function ensureUploadDir() {
  if (!fs.existsSync(CMS_UPLOAD_DIR)) {
    fs.mkdirSync(CMS_UPLOAD_DIR, { recursive: true });
  }
}

import {
  type CmsJson,
  normalizeCmsJson,
} from "@/lib/cms-types";
import { readCmsFromDb, writeCmsToDb } from "@/lib/db/cms-repository";

export async function readCms(): Promise<CmsJson> {
  return readCmsFromDb();
}

export async function writeCms(data: CmsJson): Promise<CmsJson> {
  const next = normalizeCmsJson(data);
  return writeCmsToDb(next);
}

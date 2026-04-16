import {
  type CmsJson,
  normalizeCmsJson,
} from "@/lib/cms-types";
import {
  readCmsFromDb,
  writeCmsToDb,
  type ReadCmsFromDbResult,
} from "@/lib/db/cms-repository";
import { cache } from "react";

const readCmsResultCached = cache(async (): Promise<ReadCmsFromDbResult> => {
  return readCmsFromDb();
});

export async function readCms(): Promise<CmsJson> {
  const r = await readCmsResultCached();
  return r.cms;
}

/** Same as `readCms` plus `devDbUnreachable` when Postgres is down in development. */
export async function readCmsWithDbStatus(): Promise<ReadCmsFromDbResult> {
  return readCmsResultCached();
}

export async function writeCms(data: CmsJson): Promise<CmsJson> {
  const next = normalizeCmsJson(data);
  return writeCmsToDb(next);
}

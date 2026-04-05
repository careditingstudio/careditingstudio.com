export async function fetchAdminUploadList(): Promise<string[]> {
  const r = await fetch("/api/admin/uploads");
  if (!r.ok) throw new Error("Could not load uploads");
  const data = (await r.json()) as { files?: string[] };
  return Array.isArray(data.files) ? data.files : [];
}

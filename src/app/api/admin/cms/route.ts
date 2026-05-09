import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { normalizeCmsJson, type CmsJson } from "@/lib/cms-types";
import { readCms, writeCms } from "@/lib/cms-store";
import { requireAdminApi } from "@/lib/admin-api";

export const runtime = "nodejs";

export async function GET() {
  const deny = await requireAdminApi();
  if (deny) return deny;
  return NextResponse.json(await readCms());
}

export async function PUT(request: Request) {
  const deny = await requireAdminApi();
  if (deny) return deny;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const current = await readCms();
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    const clientAt = b.updatedAt;
    if (typeof clientAt === "string" && clientAt.length > 0) {
      if (clientAt !== current.updatedAt) {
        return NextResponse.json(
          {
            error: "stale",
            message:
              "Content changed elsewhere while you were editing. Reload the admin to get the latest data, then save again.",
            updatedAt: current.updatedAt,
          },
          { status: 409 },
        );
      }
    }
  }
  const merged = normalizeCmsJson(body, current) as CmsJson;
  await writeCms(merged);
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/services/[slug]", "page");
  revalidatePath("/pricing");
  revalidatePath("/portfolio");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/free-trial");

  return NextResponse.json(await readCms());
}

import { NextResponse } from "next/server";
import { createMailboxMessage } from "@/lib/db/mailbox-repository";
import { hasCloudinaryConfigured, uploadImageBuffer } from "@/lib/cloudinary-server";
import { verifyTurnstileToken } from "@/lib/turnstile-server";

export const runtime = "nodejs";
/** Large multipart uploads with Cloudinary round-trip */
export const maxDuration = 60;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

const MAX_SAMPLE_FILES = 8;
const MAX_SAMPLE_BYTES = 10 * 1024 * 1024;

function getIpFromRequest(request: Request): string | null {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || request.headers.get("x-real-ip") || null;
}

function buildRequirements(args: {
  selectedServices: string[];
  googleDriveLink: string;
  uploadedFileSummaries: string[];
  sampleSecureUrls: string[];
}): string {
  const lines: string[] = [];
  if (args.selectedServices.length > 0) {
    lines.push(`Services: ${args.selectedServices.join(", ")}`);
  }
  if (args.googleDriveLink) {
    lines.push(`Google Drive link: ${args.googleDriveLink}`);
  }
  if (args.sampleSecureUrls.length > 0) {
    lines.push("Sample images (hosted):");
    args.sampleSecureUrls.forEach((url, i) => {
      lines.push(`${i + 1}. ${url}`);
    });
  } else if (args.uploadedFileSummaries.length > 0) {
    lines.push(`Uploaded sample filenames: ${args.uploadedFileSummaries.join(", ")}`);
  }
  return lines.filter((s) => s.length > 0).join("\n");
}

function parseServicesField(raw: FormDataEntryValue | null): string[] {
  if (raw == null) return [];
  const s = typeof raw === "string" ? raw.trim() : "";
  if (!s) return [];
  try {
    const j = JSON.parse(s) as unknown;
    if (!Array.isArray(j)) return [];
    return j.map((v) => (typeof v === "string" ? v.trim() : "")).filter(Boolean);
  } catch {
    return [];
  }
}

function isAllowedSampleFile(file: File): boolean {
  if (ALLOWED_IMAGE_TYPES.has(file.type)) return true;
  return /\.(jpe?g|png|webp|gif|avif)$/i.test(file.name);
}

export async function POST(request: Request) {
  const ct = request.headers.get("content-type") ?? "";
  if (ct.includes("multipart/form-data")) {
    return handleMultipart(request);
  }
  return handleJson(request);
}

async function handleMultipart(request: Request) {
  const ip = getIpFromRequest(request);
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const turnstileToken = String(form.get("turnstileToken") ?? "");
  const captcha = await verifyTurnstileToken({ token: turnstileToken, ip });
  if (!captcha.ok) {
    return NextResponse.json({ error: captcha.error }, { status: 400 });
  }

  const rawFiles = form.getAll("samples");
  const files = rawFiles.filter((x): x is File => x instanceof File && x.size > 0);

  if (files.length > MAX_SAMPLE_FILES) {
    return NextResponse.json(
      { error: `Maximum ${MAX_SAMPLE_FILES} sample images.` },
      { status: 400 },
    );
  }

  const uploadedSummaries: string[] = [];
  const sampleUrls: string[] = [];

  try {
    for (const file of files) {
      if (file.size > MAX_SAMPLE_BYTES) {
        return NextResponse.json(
          { error: `File "${file.name}" exceeds 10 MB.` },
          { status: 400 },
        );
      }
      if (!isAllowedSampleFile(file)) {
        return NextResponse.json(
          { error: `Unsupported type for "${file.name}" — use JPG, PNG, WebP, GIF, or AVIF.` },
          { status: 400 },
        );
      }
      uploadedSummaries.push(`${file.name} (${Math.max(1, Math.round(file.size / 1024))} KB)`);
      if (hasCloudinaryConfigured()) {
        const buf = Buffer.from(await file.arrayBuffer());
        const { secureUrl } = await uploadImageBuffer(buf, { folderSuffix: "free-trial-samples" });
        sampleUrls.push(secureUrl);
      }
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Image upload failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const selectedServices = parseServicesField(form.get("services"));
  const googleDriveLink = String(form.get("googleDriveLink") ?? "").trim();

  const requirementsWithFiles = buildRequirements({
    selectedServices,
    googleDriveLink,
    uploadedFileSummaries: uploadedSummaries,
    sampleSecureUrls: sampleUrls,
  });

  try {
    const created = await createMailboxMessage({
      kind: "FREE_TRIAL",
      fullName: form.get("fullName"),
      email: String(form.get("email") ?? "").trim() || undefined,
      whatsapp: String(form.get("whatsapp") ?? "").trim() || undefined,
      country: String(form.get("country") ?? "").trim() || undefined,
      requirements: requirementsWithFiles,
      message: form.get("message"),
      ip,
      userAgent: request.headers.get("user-agent"),
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not submit.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

async function handleJson(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const turnstileToken = typeof b.turnstileToken === "string" ? b.turnstileToken : "";
  const uploadedFiles = Array.isArray(b.uploadedFiles)
    ? b.uploadedFiles
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter((v) => v.length > 0)
    : [];

  const ip = getIpFromRequest(request);
  const captcha = await verifyTurnstileToken({ token: turnstileToken, ip });
  if (!captcha.ok) {
    return NextResponse.json({ error: captcha.error }, { status: 400 });
  }

  try {
    const selectedServices = Array.isArray(b.services)
      ? b.services
          .map((v) => (typeof v === "string" ? v.trim() : ""))
          .filter((v) => v.length > 0)
      : [];
    const googleDriveLink =
      typeof b.googleDriveLink === "string" ? b.googleDriveLink.trim() : "";

    const requirementsWithFiles = buildRequirements({
      selectedServices,
      googleDriveLink,
      uploadedFileSummaries: uploadedFiles,
      sampleSecureUrls: [],
    });

    const created = await createMailboxMessage({
      kind: "FREE_TRIAL",
      fullName: b.fullName,
      email: b.email,
      whatsapp: b.whatsapp,
      emailOrWhatsapp: b.emailOrWhatsapp,
      country: b.country,
      requirements: requirementsWithFiles,
      message: b.message,
      ip,
      userAgent: request.headers.get("user-agent"),
    });
    return NextResponse.json({ ok: true, id: created.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Could not submit.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

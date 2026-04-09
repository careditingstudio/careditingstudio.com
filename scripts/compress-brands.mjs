import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const repoRoot = process.cwd();
const brandsDir = path.join(repoRoot, "public", "brands");
const MAX_BYTES = 50 * 1024;

const selectedBases = [
  "ac",
  "ariel",
  "aston-martin",
  "audi",
  "bmw",
  "bmw-m",
  "byd",
  "cadillac",
  "chevrolet",
  "citroen",
  "daihatsu",
  "ford",
  "honda",
  "hyundai",
  "kia",
  "lexus",
  "mazda",
  "mercedes-benz",
  "mitsubishi",
  "subaru",
  "suzuki",
  "tata",
  "tesla",
  "toyota",
  "zinoro",
  "zotye",
];

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function resolveInputFile(base) {
  const exts = [".png", ".jpg", ".jpeg", ".webp", ".svg"];
  for (const ext of exts) {
    const full = path.join(brandsDir, `${base}${ext}`);
    if (await exists(full)) return full;
  }
  return null;
}

async function compressToWebp(inputPath, outPath) {
  const image = sharp(inputPath, { failOn: "none" }).rotate();

  const meta = await image.metadata();
  const width = meta.width ?? 0;

  // Logos are usually wide; keep them crisp but not huge.
  const resized =
    width && width > 420 ? image.resize({ width: 420, withoutEnlargement: true }) : image;

  let quality = 82;
  let attempt = 0;
  let buf = await resized.webp({ quality, effort: 6 }).toBuffer();

  while (buf.byteLength > MAX_BYTES && quality > 40 && attempt < 10) {
    quality -= 6;
    attempt += 1;
    buf = await resized.webp({ quality, effort: 6 }).toBuffer();
  }

  // If still too big, downscale a bit and try again.
  if (buf.byteLength > MAX_BYTES) {
    const downscaled = resized.resize({
      width: 360,
      withoutEnlargement: true,
    });
    quality = Math.min(quality, 70);
    attempt = 0;
    buf = await downscaled.webp({ quality, effort: 6 }).toBuffer();
    while (buf.byteLength > MAX_BYTES && quality > 38 && attempt < 10) {
      quality -= 6;
      attempt += 1;
      buf = await downscaled.webp({ quality, effort: 6 }).toBuffer();
    }
  }

  await fs.writeFile(outPath, buf);
  return { bytes: buf.byteLength };
}

const results = [];

for (const base of selectedBases) {
  const input = await resolveInputFile(base);
  if (!input) {
    results.push({ base, status: "missing" });
    continue;
  }
  const out = path.join(brandsDir, `${base}.webp`);
  const { bytes } = await compressToWebp(input, out);
  results.push({ base, status: "ok", bytes });
}

const missing = results.filter((r) => r.status === "missing");
if (missing.length) {
  console.warn(
    `Missing inputs: ${missing.map((m) => m.base).join(", ")} (no png/jpg/webp/svg found)`
  );
}

const tooBig = results.filter((r) => r.status === "ok" && r.bytes > MAX_BYTES);
if (tooBig.length) {
  console.warn(
    `Over 50KB after compression: ${tooBig
      .map((t) => `${t.base}=${Math.round(t.bytes / 1024)}KB`)
      .join(", ")}`
  );
}

console.log(
  results
    .filter((r) => r.status === "ok")
    .map((r) => `${r.base}.webp  ${Math.round(r.bytes / 1024)}KB`)
    .join("\n")
);


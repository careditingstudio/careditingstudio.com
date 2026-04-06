/**
 * Environment variable names for production and local `.env`.
 *
 * **Vercel ↔ Supabase** — use exactly these keys (do not add `DATABASE_URL` or other
 * aliases for Postgres/Supabase). Prisma reads `POSTGRES_PRISMA_URL` and
 * `POSTGRES_URL_NON_POOLING` from `schema.prisma`; the other Postgres/Supabase vars
 * are for tooling, clients, and dashboard parity with Vercel.
 *
 * **This app** — Cloudinary and CMS cookie auth are not created by the Supabase
 * integration; add them in Vercel “Environment Variables” alongside the Supabase set.
 */
export const ENV_VERCEL_SUPABASE = {
  POSTGRES_DATABASE: "POSTGRES_DATABASE",
  POSTGRES_HOST: "POSTGRES_HOST",
  POSTGRES_PASSWORD: "POSTGRES_PASSWORD",
  POSTGRES_PRISMA_URL: "POSTGRES_PRISMA_URL",
  POSTGRES_URL: "POSTGRES_URL",
  POSTGRES_URL_NON_POOLING: "POSTGRES_URL_NON_POOLING",
  POSTGRES_USER: "POSTGRES_USER",
  NEXT_PUBLIC_SUPABASE_URL: "NEXT_PUBLIC_SUPABASE_URL",
  SUPABASE_ANON_KEY: "SUPABASE_ANON_KEY",
  SUPABASE_PUBLISHABLE_KEY: "SUPABASE_PUBLISHABLE_KEY",
  SUPABASE_SERVICE_ROLE_KEY: "SUPABASE_SERVICE_ROLE_KEY",
  SUPABASE_SECRET_KEY: "SUPABASE_SECRET_KEY",
  SUPABASE_JWT_SECRET: "SUPABASE_JWT_SECRET",
} as const;

/** Required for admin uploads / media library (Cloudinary dashboard). */
export const ENV_APP = {
  CLOUDINARY_CLOUD_NAME: "CLOUDINARY_CLOUD_NAME",
  CLOUDINARY_API_KEY: "CLOUDINARY_API_KEY",
  CLOUDINARY_API_SECRET: "CLOUDINARY_API_SECRET",
  CLOUDINARY_UPLOAD_FOLDER: "CLOUDINARY_UPLOAD_FOLDER",
  ADMIN_USERNAME: "ADMIN_USERNAME",
  ADMIN_PASSWORD: "ADMIN_PASSWORD",
  CMS_AUTH_SECRET: "CMS_AUTH_SECRET",
} as const;

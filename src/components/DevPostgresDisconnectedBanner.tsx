import { ENV_VERCEL_SUPABASE } from "@/config/deployment-env";

export function DevPostgresDisconnectedBanner({ show }: { show: boolean }) {
  if (!show) return null;
  const pool = ENV_VERCEL_SUPABASE.POSTGRES_PRISMA_URL;
  const direct = ENV_VERCEL_SUPABASE.POSTGRES_URL_NON_POOLING;
  return (
    <div
      className="relative z-[100] border-b border-amber-800/70 bg-amber-950/95 px-4 py-2.5 text-center text-[13px] leading-snug text-amber-100"
      role="alert"
    >
      <strong className="font-semibold">Local dev — Postgres unreachable.</strong>{" "}
      The public site loads image URLs from the database; Cloudinary only hosts
      the files. Until{" "}
      <code className="rounded bg-black/35 px-1 font-mono text-[11px]">
        {pool}
      </code>{" "}
      works from this PC, heroes and portfolio stay empty (production still
      works on Vercel). For{" "}
      <code className="rounded bg-black/35 px-1 font-mono text-[11px]">
        {direct}
      </code>
      , use Supabase&apos;s <span className="font-medium">direct</span> URI
      (host like{" "}
      <code className="font-mono text-[11px]">db.&lt;project&gt;.supabase.co</code>
      ), not the pooler hostname on 5432.
    </div>
  );
}

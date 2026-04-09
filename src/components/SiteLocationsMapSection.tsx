import type { SiteSettings } from "@/lib/cms-types";

function cleanUrl(url: string): string {
  const u = url.trim();
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

function isEmbeddable(url: string): boolean {
  const u = url.toLowerCase();
  return u.includes("google.com/maps/embed") || u.includes("www.google.com/maps/embed");
}

function fallbackEmbedSrc(query: string): string {
  // Works without an API key (simple search embed).
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

export function SiteLocationsMapSection({ site }: { site: SiteSettings }) {
  const offices = (site.officeLocations ?? []).filter(
    (o) => o.label.trim().length > 0 || o.address.trim().length > 0,
  );
  if (offices.length === 0) return null;

  return (
    <section className="relative z-20 border-t border-[var(--line)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-6 flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-2)]">
            Locate us
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
            Our offices
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {offices.slice(0, 2).map((o, i) => {
            const map = cleanUrl(o.mapUrl);
            const embedSrc =
              map && isEmbeddable(map)
                ? map
                : o.address.trim()
                  ? fallbackEmbedSrc(o.address.trim())
                  : map
                    ? fallbackEmbedSrc(map)
                    : "";
            return (
              <div
                key={`${o.label}-${i}`}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-black/10"
              >
                <div className="aspect-[16/10] bg-zinc-900">
                  {embedSrc ? (
                    <iframe
                      src={embedSrc}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="h-full w-full"
                      title={o.label || `Office ${i + 1}`}
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-zinc-400">
                      Map not set
                    </div>
                  )}
                </div>
                <div className="space-y-2 p-5">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {o.label.trim() || `Office ${i + 1}`}
                  </p>
                  {o.address.trim() ? (
                    <p className="text-sm leading-relaxed text-[var(--muted)]">
                      {o.address.trim()}
                    </p>
                  ) : null}
                  {map ? (
                    <a
                      className="inline-flex text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-hover)]"
                      href={map}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in Google Maps →
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


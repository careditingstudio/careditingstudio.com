import { display } from "@/app/fonts";
import { isUploadedAsset } from "@/lib/cms-types";
import Image from "next/image";

export function ServicePageHero({
  title,
  description,
  bannerSrc,
}: {
  title: string;
  description?: string;
  bannerSrc?: string;
}) {
  const src = bannerSrc?.trim() ?? "";
  const hasBanner = src.length > 0;

  return (
    <header className="border-b border-[var(--line)] bg-[var(--background)]">
      <div className="relative min-h-[220px] w-full overflow-hidden border-y border-[var(--line)] bg-zinc-100 dark:bg-zinc-900/60 sm:min-h-[260px] lg:min-h-[320px]">
          {hasBanner ? (
            <>
              <Image
                src={src}
                alt={`${title} — hero banner`}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                unoptimized={isUploadedAsset(src)}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/20" />
            </>
          ) : (
            <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 p-8 text-center sm:min-h-[260px] lg:min-h-[320px]">
              <span className="text-sm font-medium text-[var(--muted-2)]">
                Banner
              </span>
              <span className="max-w-xs text-xs text-[var(--muted)]">
                Add a hero image in the admin service page (Hero banner URL).
              </span>
            </div>
          )}

          <div className="absolute inset-x-0 top-0 z-10 p-5 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[88rem]">
              <div className="max-w-2xl">
              <h1
                className={`${display.className} text-3xl font-semibold tracking-tight text-white sm:text-[2.15rem] sm:leading-tight lg:text-[2.35rem]`}
              >
                {title}
              </h1>
              {description ? (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-200 sm:text-base">
                  {description}
                </p>
              ) : null}
              </div>
            </div>
          </div>
      </div>
    </header>
  );
}

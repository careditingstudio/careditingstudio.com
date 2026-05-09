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
    <header
      className="relative isolate w-full overflow-hidden bg-[#0a0a0a]"
      aria-labelledby="service-hero-title"
    >
      <div className="relative h-[clamp(420px,52vw,620px)] w-full">
        {hasBanner ? (
          <Image
            src={src}
            alt={`${title} hero banner`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
            unoptimized={isUploadedAsset(src)}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(120%_90%_at_18%_10%,rgba(224,122,69,0.22)_0%,transparent_55%),radial-gradient(110%_85%_at_82%_90%,rgba(255,255,255,0.05)_0%,transparent_55%)]"
          />
        )}

        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.7)_38%,rgba(0,0,0,0.45)_70%,rgba(0,0,0,0.25)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55)_0%,transparent_30%,transparent_70%,rgba(0,0,0,0.25)_100%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_50%,black_0%,transparent_75%)]"
        />

        <div className="relative z-10 flex h-full w-full items-center">
          <div className="mx-auto w-full max-w-[88rem] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
            <div className="max-w-2xl space-y-5">
              <h1
                id="service-hero-title"
                className={`${display.className} text-balance text-3xl font-semibold tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)] sm:text-4xl md:text-[2.6rem] md:leading-[1.1] lg:text-[3rem]`}
              >
                {title}
              </h1>
              {description?.trim() ? (
                <p className="max-w-xl whitespace-pre-line text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)] sm:text-base md:text-[1.05rem]">
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

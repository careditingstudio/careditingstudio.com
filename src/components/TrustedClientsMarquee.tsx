import { display } from "@/app/fonts";
import Image from "next/image";

type TrustedClientsMarqueeProps = {
  maxLogos?: number;
  heading?: string;
};

export function TrustedClientsMarquee({
  maxLogos = 30,
  heading = "Trusted by Leading Brands",
}: TrustedClientsMarqueeProps) {
  const brandFiles = [
    "ac.webp",
    "ariel.webp",
    "aston-martin.webp",
    "audi.webp",
    "bmw.webp",
    "bmw-m.webp",
    "byd.webp",
    "cadillac.webp",
    "chevrolet.webp",
    "citroen.webp",
    "daihatsu.webp",
    "ford.webp",
    "honda.webp",
    "hyundai.webp",
    "kia.webp",
    "lexus.webp",
    "mazda.webp",
    "mercedes-benz.webp",
    "mitsubishi.webp",
    "subaru.webp",
    "suzuki.webp",
    "tata.webp",
    "tesla.webp",
    "toyota.webp",
    "zinoro.webp",
    "zotye.webp",
  ].slice(0, Math.max(1, maxLogos));

  const logos = brandFiles.map((file) => {
    const label = file
      .replace(/\.(png|jpe?g|webp|svg)$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      src: `/brands/${file}`,
      alt: `${label} logo`,
    };
  });

  const loop = [...logos, ...logos];

  return (
    <section
      className="relative z-20 overflow-hidden px-4 py-14 text-[var(--foreground)] sm:px-6 sm:py-16 lg:px-8"
      aria-label="Trusted clients"
      style={{ ["--home-trust-marquee-secs" as never]: "68s" }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-16 bg-gradient-to-b from-black/60 via-black/20 to-transparent sm:h-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-16 bg-gradient-to-t from-[var(--background)]/75 via-[var(--background)]/25 to-transparent sm:h-20"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-[82rem]">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2
            className={`${display.className} text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.6rem] md:leading-tight`}
          >
            <span>{heading.split(" by ")[0] ?? "Trusted"}</span>{" "}
            <span className="bg-gradient-to-r from-[var(--accent)] via-orange-300 to-[var(--accent)] bg-[length:200%_100%] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(224,122,69,0.3)] motion-safe:animate-[pulse_4s_ease-in-out_infinite]">
              {heading.split(" by ").length > 1
                ? `by ${heading.split(" by ")[1]}`
                : "by Leading Brands"}
            </span>
          </h2>
          <p className="max-w-3xl text-balance text-sm leading-relaxed text-[var(--muted)] motion-safe:animate-[ces-reveal-up_800ms_cubic-bezier(0.2,0.9,0.2,1)_both] sm:text-base md:text-lg">
            We proudly collaborate with top companies who rely on our expertise
            for high-quality car photo editing services.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/12 bg-transparent px-3 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:px-5">
          <div
            className="relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="home-trust-marquee-track flex w-max items-center gap-2 pr-2 sm:gap-3 sm:pr-3">
              {loop.map((logo, idx) => (
                <div
                  key={`${logo.src}-${idx}`}
                  className="flex h-12 w-36 items-center justify-center px-2 sm:h-14 sm:w-40"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={64}
                    className="h-8 w-auto max-w-[10rem] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.28)] transition sm:h-9"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


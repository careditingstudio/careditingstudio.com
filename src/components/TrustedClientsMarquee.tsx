import { display } from "@/app/fonts";
import Image from "next/image";

type TrustedClientsMarqueeProps = {
  maxLogos?: number;
  heading?: string;
};

export function TrustedClientsMarquee({
  maxLogos = 30,
  heading = "Trusted Clients",
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
      className="relative z-20 overflow-hidden px-5 py-14 text-[var(--foreground)] sm:px-8 sm:py-16"
      aria-label="Trusted clients"
      style={{ ["--home-trust-marquee-secs" as never]: "96s" }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-black/35 backdrop-blur-md"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-70"
        style={{
          background:
            "radial-gradient(600px 200px at 50% 0%, rgba(224, 122, 69, 0.22), transparent 60%), radial-gradient(520px 240px at 10% 30%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(520px 240px at 90% 40%, rgba(255,255,255,0.06), transparent 60%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2
            className={`${display.className} text-balance text-3xl font-semibold tracking-tight sm:text-4xl`}
          >
            <span className="text-white/90">{heading.split(" ")[0] ?? "Trusted"} </span>
            <span className="text-[var(--accent)]">
              {heading.split(" ").slice(1).join(" ") || "Clients"}
            </span>
          </h2>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/6 px-3 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:px-5">
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
                  className="group relative flex h-12 w-36 items-center justify-center px-2 sm:h-14 sm:w-40"
                >
                  <div
                    className="pointer-events-none absolute inset-0 opacity-35 blur-xl"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0))",
                    }}
                    aria-hidden
                  />
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={64}
                    className="relative h-9 w-auto max-w-[11rem] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.22)] transition sm:h-10"
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


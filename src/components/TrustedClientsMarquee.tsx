import { display } from "@/app/fonts";
import Image from "next/image";

type TrustedClientsMarqueeProps = {
  logoCount?: number;
  heading?: string;
};

export function TrustedClientsMarquee({
  logoCount = 18,
  heading = "Trusted Clients",
}: TrustedClientsMarqueeProps) {
  const logos = Array.from({ length: logoCount }, (_, idx) => ({
    src: `/homepage/trust/logo${idx + 1}.webp`,
    alt: `Trusted client logo ${idx + 1}`,
  }));

  const loop = [...logos, ...logos];

  return (
    <section
      className="relative z-20 overflow-hidden px-5 py-14 text-[var(--foreground)] sm:px-8 sm:py-16"
      aria-label="Trusted clients"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-black/55 backdrop-blur-xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
        style={{
          background:
            "radial-gradient(600px 200px at 50% 0%, rgba(224, 122, 69, 0.22), transparent 60%), radial-gradient(520px 240px at 10% 30%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(520px 240px at 90% 40%, rgba(255,255,255,0.06), transparent 60%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-16 bg-gradient-to-b from-black/80 to-transparent sm:h-20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-16 bg-gradient-to-t from-black/80 to-transparent sm:h-20"
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

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-3 py-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur sm:px-5">
          <div
            className="relative overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            <div className="home-trust-marquee-track flex w-max items-center gap-4 pr-4 sm:gap-5 sm:pr-5">
              {loop.map((logo, idx) => (
                <div
                  key={`${logo.src}-${idx}`}
                  className="flex h-14 w-40 items-center justify-center rounded-xl border border-white/10 bg-white/90 px-4 shadow-[0_1px_0_rgba(0,0,0,0.08)] sm:h-16 sm:w-44"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={160}
                    height={64}
                    className="h-8 w-auto max-w-[10rem] object-contain opacity-95 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-9"
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


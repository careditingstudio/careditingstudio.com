import { HomeIntroFloatingCar } from "@/components/HomeIntroFloatingCar";
import { display, sans } from "@/app/fonts";

type Props = {
  floatingCar: string;
};

/**
 * Second home band: copy left + car right.
 * The car lives in a horizontally clipped column; the copy column uses the section background so the car
 * vanishes at the seam (masked) instead of painting over or fading through the text.
 */
export function HomeIntroSection({ floatingCar }: Props) {
  const hasCar = floatingCar.trim().length > 0;

  const introCopy = (
    <>
      <h2
        id="home-intro-heading"
        className={`${display.className} text-balance text-[2.125rem] font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl sm:leading-[1.1] md:text-[2.65rem] md:leading-[1.1] lg:text-[2.9rem] lg:leading-[1.08] xl:text-[3.05rem]`}
      >
        Make Every Vehicle Image Look{" "}
        <span className="bg-gradient-to-r from-[var(--accent)] via-[#f4a574] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(224,122,69,0.35)]">
          Premium
        </span>{" "}
        and{" "}
        <span className="bg-gradient-to-r from-[var(--accent)] via-[#f4a574] to-[var(--accent)] bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(224,122,69,0.35)]">
          Eye-Catching
        </span>
      </h2>
      <p
        className={`${sans.className} mt-6 max-w-xl text-lg leading-relaxed text-zinc-400 md:text-xl ${hasCar ? "" : "mx-auto"}`}
      >
        Get polished, professional images that attract more
        <br />
        customers and help grow your automotive business.
        <br />
        We deliver clean, realistic, and high impact car photos.
      </p>
    </>
  );

  return (
    <section
      id="home-scroll-sentinel"
      className="relative z-20 -mt-[clamp(1.25rem,3vw,2.5rem)] overflow-visible bg-[#1a1a1c] px-4 pb-12 pt-[clamp(3.5rem,8vw,5.75rem)] sm:px-6 sm:pb-14 sm:pt-[clamp(4rem,9vw,6.25rem)] lg:px-8"
      aria-labelledby="home-intro-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-[var(--accent)] opacity-90"
        aria-hidden
      />

      <div
        className={
          hasCar
            ? "relative mx-auto grid max-w-[82rem] grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.02fr)_minmax(260px,0.98fr)] lg:gap-8 xl:gap-14"
            : "mx-auto max-w-3xl text-center"
        }
      >
        {hasCar ? (
          <>
            <div className="relative z-10 order-1 min-w-0 bg-[#1a1a1c] text-left lg:order-none lg:col-start-1 lg:row-start-1">
              {introCopy}
            </div>
            <div className="relative z-0 order-2 flex min-h-[min(280px,55vw)] w-full flex-col justify-center overflow-hidden py-3 pt-4 lg:order-none lg:col-start-2 lg:row-start-1 lg:min-h-[min(360px,42vw)] lg:py-4 lg:pt-5">
              <HomeIntroFloatingCar src={floatingCar} />
            </div>
          </>
        ) : (
          <div className="min-w-0">{introCopy}</div>
        )}
      </div>
    </section>
  );
}

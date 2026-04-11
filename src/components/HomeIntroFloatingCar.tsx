import Image from "next/image";

type Props = {
  src: string;
};

function isCloudinaryUrl(url: string): boolean {
  try {
    const h = new URL(url).hostname;
    return h === "res.cloudinary.com" || h.endsWith(".cloudinary.com");
  } catch {
    return false;
  }
}

/**
 * Cutout vehicle — loops horizontally inside its parent.
 * Parent should use overflow-x-clip + opaque neighbor column so the car never draws over the copy.
 */
export function HomeIntroFloatingCar({ src }: Props) {
  const trimmed = src.trim();
  if (!trimmed) return null;

  const cloudinary = isCloudinaryUrl(trimmed);

  const imgClass =
    "h-auto w-full select-none object-contain outline-none [filter:drop-shadow(0_32px_48px_rgba(0,0,0,0.48))] lg:[filter:drop-shadow(0_42px_60px_rgba(0,0,0,0.42))]";

  return (
    <div className="flex w-full justify-center lg:justify-end lg:pl-2 xl:pl-4">
      <div className="home-intro-car-loop relative w-full max-w-[min(96vw,680px)] lg:max-w-[min(100%,760px)] xl:max-w-[min(100%,840px)]">
        {cloudinary ? (
          <Image
            src={trimmed}
            alt=""
            width={1600}
            height={1000}
            sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 48vw, 96vw"
            className={imgClass}
            draggable={false}
            priority={false}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary CMS URLs
          <img
            src={trimmed}
            alt=""
            width={1600}
            height={1000}
            draggable={false}
            loading="lazy"
            decoding="async"
            className={imgClass}
          />
        )}
      </div>
    </div>
  );
}

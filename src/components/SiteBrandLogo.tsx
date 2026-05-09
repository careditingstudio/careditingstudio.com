import Image from "next/image";

type SiteBrandLogoProps = {
  /** When true, blends out typical flat white icon backgrounds on dark surfaces (multiply). */
  blendMultiply?: boolean;
  className?: string;
};

export function SiteBrandLogo({
  blendMultiply = true,
  className,
}: SiteBrandLogoProps) {
  return (
    <span
      className={`relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-white/20 bg-transparent shadow-[0_8px_28px_-14px_rgba(0,0,0,0.45)] ${className ?? ""}`}
    >
      <Image
        src="/icon.png"
        alt=""
        width={44}
        height={44}
        className={`h-9 w-9 object-contain ${blendMultiply ? "mix-blend-multiply" : ""}`}
        priority
        aria-hidden
      />
    </span>
  );
}

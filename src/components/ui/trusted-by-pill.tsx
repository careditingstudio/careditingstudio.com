"use client";

import { sans } from "@/app/fonts";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/** Stable Unsplash portrait crops — verified paths on images.unsplash.com */
const TRUSTED_AVATARS = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces&q=80",
    alt: "Professional portrait",
    initials: "KS",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&q=80",
    alt: "Professional portrait",
    initials: "JR",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces&q=80",
    alt: "Professional portrait",
    initials: "MT",
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces&q=80",
    alt: "Professional portrait",
    initials: "LW",
  },
] as const;

type TrustedByPillProps = {
  className?: string;
};

export function TrustedByPill({ className }: TrustedByPillProps) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center rounded-full border border-zinc-200/90 bg-white px-1 py-0.5 shadow-sm shadow-black/10",
        className,
      )}
    >
      <div className="flex -space-x-1.5 pl-0.5">
        {TRUSTED_AVATARS.map((a) => (
          <Avatar
            key={a.src}
            className="h-5 w-5 ring-2 ring-white"
          >
            <AvatarImage src={a.src} alt={a.alt} className="object-cover" />
            <AvatarFallback
              className={`${sans.className} bg-zinc-200 text-[9px] font-medium text-zinc-600`}
            >
              {a.initials}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <p
        className={`${sans.className} px-2 text-[11px] leading-tight text-zinc-600 sm:text-xs`}
      >
        Trusted by{" "}
        <strong className="font-semibold text-zinc-900">60K+</strong> clients.
      </p>
    </div>
  );
}

import Image from "next/image";
import { MapPin } from "lucide-react";
import { profile } from "@/data/site";
import { AvailabilityBadge } from "@/components/nav/AvailabilityBadge";

export function ProfileCard() {
  return (
    <article
      aria-label="Profile"
      className="grid overflow-hidden rounded-[28px] border border-line bg-surface shadow-card h-full md:grid-cols-2"
    >
      {/* Square photo shown whole, so both award plaques stay in frame. */}
      <div className="relative aspect-square bg-night">
        <Image
          src={profile.portrait.src}
          alt={profile.portrait.alt}
          width={profile.portrait.width}
          height={profile.portrait.height}
          sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw"
          priority
          className="size-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between gap-5 p-6">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand-ink uppercase">Hello, I’m</p>
          <p className="mt-1.5 text-2xl leading-tight font-bold tracking-tight">{profile.name}</p>
          <p className="mt-1 text-[15px] text-muted">{profile.title}</p>
          <p className="mt-3 text-sm text-muted">{profile.specialties.join(" · ")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
            <MapPin className="size-4 text-brand-ink" aria-hidden="true" />
            {profile.location}
          </span>
          <AvailabilityBadge />
        </div>
      </div>
    </article>
  );
}

import { profile } from "@/data/site";

export function AvailabilityBadge({ tone = "light" }: { tone?: "light" | "dark" }) {
  const styles =
    tone === "dark"
      ? "border-white/15 bg-white/5 text-white/85"
      : "border-line bg-surface text-fg";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-medium ${styles}`}
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-emerald-500/60 motion-safe:animate-ping" />
        <span className="relative size-2 rounded-full bg-emerald-600" />
      </span>
      {profile.availability}
    </span>
  );
}

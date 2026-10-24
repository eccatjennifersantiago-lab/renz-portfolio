import { ChartNoAxesColumnIncreasing, FolderOpen, House, Layers, Mail, UserRound } from "lucide-react";
import type { NavId } from "@/data/site";

const icons = {
  home: House,
  results: ChartNoAxesColumnIncreasing,
  projects: FolderOpen,
  services: Layers,
  about: UserRound,
  contact: Mail,
} satisfies Record<NavId, unknown>;

export function NavIcon({ id, className }: { id: NavId; className?: string }) {
  const Icon = icons[id];
  return <Icon className={className} aria-hidden="true" strokeWidth={1.8} />;
}

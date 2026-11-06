import { skillIcons } from "@/data/skill-icons";
import { cn } from "@/lib/utils";

/** Full-colour logo for a skill (decorative — the skill name is always shown next to it). */
export default function SkillIcon({
  name,
  size = 16,
  className,
  eager = false,
}: {
  name: string;
  size?: number;
  className?: string;
  /** Load immediately — for places like the marquee where icons slide in from off-screen. */
  eager?: boolean;
}) {
  const file = skillIcons[name];
  if (!file) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/skills/${file}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      className={cn("shrink-0 object-contain", className)}
      style={{ width: size, height: size }}
    />
  );
}

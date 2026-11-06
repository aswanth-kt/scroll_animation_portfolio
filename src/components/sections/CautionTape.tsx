"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { marquee, site } from "@/data/content";
import SkillIcon from "@/components/ui/SkillIcon";
import { cn } from "@/lib/utils";

function Row({ items, variant }: { items: string[]; variant: "accent" | "dark" }) {
  const content = (
    <div className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-5 px-5 md:gap-8 md:px-8">
          {variant === "dark" && <SkillIcon name={item} size={30} eager />}
          <span className="whitespace-nowrap">{item}</span>
          <span aria-hidden="true" className={cn("text-[0.6em]", variant === "accent" ? "text-accent-ink" : "text-accent")}>
            ✦
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div data-row className="flex w-max will-change-transform">
      {content}
      <div aria-hidden="true" className="flex">
        {content}
      </div>
    </div>
  );
}

/** Two crossing tapes; they run faster with scroll velocity and reverse with direction. */
export default function CautionTape() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
      const tweens = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i === 0 ? 0 : -50 }, { xPercent: i === 0 ? -50 : 0, duration: i === 0 ? 38 : 46, ease: "none", repeat: -1 }),
      );
      // Start deep into the repeat so playing backwards never hits time 0.
      tweens.forEach((t) => t.totalTime(t.duration() * 500));
      let dir = 1;
      let target = 1;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          dir = self.direction;
          target = dir * (1 + Math.min(Math.abs(self.getVelocity()) / 260, 6));
        },
      });
      const tick = () => {
        target += (dir - target) * 0.05;
        tweens.forEach((t) => t.timeScale(t.timeScale() + (target - t.timeScale()) * 0.15));
      };
      gsap.ticker.add(tick);
      return () => {
        st.kill();
        gsap.ticker.remove(tick);
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-label="Technologies I work with" role="region" className="relative overflow-hidden py-16 md:py-24">
      <div className="-mx-8 -rotate-[2.5deg] border-y border-accent-ink/20 [background:var(--gold-gradient)] py-4 text-[clamp(1.4rem,3vw,2.6rem)] font-medium tracking-[-0.03em] text-accent-ink md:py-5">
        <Row variant="accent" items={[site.availability, `${site.role} @ ${site.companyShort}`, "MERN Stack", "Zero-error mindset", "Production-ready APIs"]} />
      </div>
      <div className="-mx-8 -mt-3 rotate-[1.8deg] border-y border-line bg-surface py-4 text-[clamp(1.2rem,2.4vw,2rem)] font-medium tracking-[-0.02em] text-fg md:py-5">
        <Row variant="dark" items={marquee} />
      </div>
    </div>
  );
}

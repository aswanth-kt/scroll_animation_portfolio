"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Section intro: "(01) — About" label + a heading whose lines slide up
 * out of a mask when it scrolls into view.
 */
export default function SectionHeading({
  index,
  label,
  children,
  aside,
  className,
}: {
  index: string;
  label: string;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const heading = ref.current?.querySelector("h2");
      if (!heading) return;
      gsap.from(ref.current!.querySelectorAll("[data-label] > *"), {
        yPercent: 100,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      gsap.from(ref.current!.querySelector("[data-rule]"), {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 105,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.09,
            scrollTrigger: { trigger: heading, start: "top 85%", once: true },
          }),
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("mb-14 md:mb-20", className)}>
      <div className="mb-8 flex items-center gap-4">
        <div data-label className="flex overflow-hidden eyebrow">
          <span className="text-accent">({index})</span>
          <span className="ml-3">{label}</span>
        </div>
        <span data-rule className="h-px flex-1 bg-line" />
      </div>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <h2 className="max-w-5xl text-[clamp(2.6rem,6.4vw,6.5rem)] leading-[0.95] font-medium tracking-[-0.045em] text-balance">
          {children}
        </h2>
        {aside && <div className="max-w-sm text-base leading-relaxed text-muted lg:pb-3">{aside}</div>}
      </div>
    </div>
  );
}

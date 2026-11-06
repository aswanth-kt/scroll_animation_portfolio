"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, hasFinePointer } from "@/lib/gsap";
import { skills } from "@/data/content";
import { cn, pad } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillIcon from "@/components/ui/SkillIcon";
import { skillIcons } from "@/data/skill-icons";
import Terminal from "./Terminal";

const SPANS = [
  "lg:col-span-5", // Backend
  "lg:col-span-5", // Frontend
  "lg:col-span-4", // Database
  "lg:col-span-4", // Auth
  "lg:col-span-4", // Deployment
  "lg:col-span-6", // Integrations
  "lg:col-span-6", // Tools
];

export default function Stack() {
  const root = useRef<HTMLElement>(null);
  const grid = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]", grid.current);

      // One pointer listener drives the spotlight on every card.
      let cleanup = () => {};
      if (hasFinePointer()) {
        let frame = 0;
        const onMove = (e: PointerEvent) => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            for (const card of cards) {
              const r = card.getBoundingClientRect();
              card.style.setProperty("--x", `${e.clientX - r.left}px`);
              card.style.setProperty("--y", `${e.clientY - r.top}px`);
            }
          });
        };
        const el = grid.current!;
        el.addEventListener("pointermove", onMove);
        cleanup = () => {
          cancelAnimationFrame(frame);
          el.removeEventListener("pointermove", onMove);
        };
      }

      if (prefersReducedMotion()) return cleanup;
      gsap.from(cards, {
        y: 60,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: { each: 0.07, from: "start" },
        scrollTrigger: { trigger: grid.current, start: "top 80%", once: true },
      });
      return cleanup;
    },
    { scope: root },
  );

  return (
    <section id="stack" ref={root} className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="02"
          label="Stack"
          aside="Grouped as working systems, not loose badges. Or skip the reading — the terminal takes commands."
        >
          The tools I use to <em className="serif text-accent">ship</em> production software.
        </SectionHeading>

        <div ref={grid} className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
          {/* Fixed height on small screens; on desktop `contain: size` makes it fill the two rows
              beside it instead of growing them as output is added. */}
          <div data-card className="spotlight h-[460px] overflow-hidden rounded-[24px] border border-line bg-[#0e0d0b] md:col-span-2 md:h-[500px] lg:col-span-7 lg:row-span-2 lg:h-auto lg:[contain:size]">
            <Terminal />
          </div>

          {skills.map((s, i) => (
            <article
              key={s.group}
              data-card
              className={cn(
                "spotlight group/card flex flex-col justify-between gap-10 rounded-[24px] border border-line bg-surface p-6 md:p-7",
                SPANS[i],
                i >= 5 && "md:col-span-1",
              )}
            >
              <div>
                <div className="mb-6 flex items-center justify-between eyebrow">
                  <span className="text-accent">SPEC.{pad(i + 1)}</span>
                  <span>{pad(s.items.length)} items</span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-medium tracking-[-0.03em] md:text-[1.75rem]">{s.group}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.blurb}</p>
                  </div>
                  {/* Logo cluster */}
                  <div className="flex shrink-0 -space-x-2.5 pt-1" aria-hidden="true">
                    {s.items
                      .filter((item) => skillIcons[item])
                      .slice(0, 4)
                      .map((item, k) => (
                        <span
                          key={item}
                          className="grid size-10 place-items-center rounded-full border border-line-strong bg-raised shadow-[0_6px_16px_-6px_rgb(0_0_0/0.8)] transition-transform duration-500 ease-[var(--ease-expo)] group-hover/card:translate-y-[-3px]"
                          style={{ zIndex: 4 - k, transitionDelay: `${k * 40}ms` }}
                        >
                          <SkillIcon name={item} size={20} />
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              <ul className="flex flex-wrap gap-2">
                {s.items.map((item) => (
                  <li key={item} className="chip gap-2 py-1.5 pr-3.5 pl-2 transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/[0.06] hover:text-fg">
                    <SkillIcon name={item} size={15} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

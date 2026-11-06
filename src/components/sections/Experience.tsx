"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { timeline } from "@/data/content";
import { cn, pad } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import SkillIcon from "@/components/ui/SkillIcon";

const startYear = (period: string) => period.match(/\d{4}/)?.[0] ?? "";

export default function Experience() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]", root.current);
      const reduce = prefersReducedMotion();
      rows.forEach((row) => {
        const fill = row.querySelector("[data-fill]");
        ScrollTrigger.create({
          trigger: row,
          start: "top 62%",
          onEnter: () => (row.dataset.on = "true"),
          onLeaveBack: () => (row.dataset.on = "false"),
        });
        if (reduce) {
          gsap.set(fill, { clipPath: "inset(0% 0% 0% 0%)" });
          return;
        }
        gsap.fromTo(
          fill,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: row, start: "top 62%", end: "bottom 62%", scrub: true } },
        );
        gsap.from(row.querySelectorAll("[data-in]"), {
          y: 50,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: row, start: "top 78%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          index="03"
          label="Experience"
          aside="Two careers on one measured line — railway build discipline, carried into full-stack delivery."
        >
          The line <em className="serif text-accent">so far.</em>
        </SectionHeading>

        <ol>
          {timeline.map((t, i) => {
            const major = t.kind === "work";
            return (
              <li
                key={`${t.org}-${t.period}`}
                data-row
                data-on="false"
                className="group/row grid grid-cols-[28px_minmax(0,1fr)] gap-x-5 lg:grid-cols-[minmax(0,3fr)_72px_minmax(0,8fr)] lg:gap-x-0"
              >
                {/* Year column (desktop) */}
                <div className="hidden pr-10 text-right lg:block" data-in>
                  <p className="text-[clamp(3rem,5vw,5rem)] leading-none font-medium tracking-[-0.05em] text-fg/25 transition-colors duration-700 group-data-[on=true]/row:text-fg">
                    {startYear(t.period)}
                  </p>
                  {t.period !== startYear(t.period) && <p className="mt-3 eyebrow">{t.period}</p>}
                </div>

                {/* Track */}
                <div className="relative flex justify-center" aria-hidden="true">
                  <div className="track absolute inset-y-0 w-4" />
                  <div
                    data-fill
                    className="absolute inset-y-0 w-4 [background:linear-gradient(var(--color-accent),var(--color-accent))_left/2px_100%_no-repeat,linear-gradient(var(--color-accent),var(--color-accent))_right/2px_100%_no-repeat] [clip-path:inset(0%_0%_100%_0%)] drop-shadow-[0_0_6px_rgb(var(--accent-rgb)/0.6)]"
                  />
                  {i === timeline.length - 1 && (
                    // buffer stop at the end of the line
                    <span className="absolute bottom-0 h-1 w-8 rounded-full bg-fg/30 transition-colors duration-700 group-data-[on=true]/row:bg-accent" />
                  )}
                  <span className="relative z-10 mt-2 grid size-7 place-items-center rounded-full border border-line-strong bg-bg transition-colors duration-500 group-data-[on=true]/row:border-accent">
                    <span className="size-2 rounded-full bg-fg/40 transition-all duration-500 group-data-[on=true]/row:scale-125 group-data-[on=true]/row:bg-accent" />
                  </span>
                </div>

                {/* Content */}
                <div className={i === timeline.length - 1 ? "pb-0" : "pb-16 md:pb-24"}>
                  <article
                    data-in
                    className={cn(
                      "rounded-[24px] border border-line transition-colors duration-700",
                      major ? "bg-surface p-6 md:p-10 group-data-[on=true]/row:border-line-strong" : "p-6 md:px-10 md:py-7",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 eyebrow">
                      <span className="flex items-center gap-3">
                        {t.current && (
                          <span className="flex items-center gap-1.5 rounded-full bg-accent px-2 py-0.5 text-[10px] text-accent-ink">
                            <span className="size-1.5 animate-pulse rounded-full bg-accent-ink" />
                            Now
                          </span>
                        )}
                        {t.chainage !== "—" && <span className="text-accent">{t.chainage}</span>}
                        <span className="rounded-full border border-line px-2 py-0.5 text-[10px]">{t.kind === "work" ? "Work" : "Education"}</span>
                      </span>
                      <span className="lg:hidden">{t.period}</span>
                    </div>
                    <h3 className={cn("mt-5 font-medium tracking-[-0.035em]", major ? "text-[clamp(1.9rem,3.6vw,3.25rem)] leading-[1.02]" : "text-2xl md:text-3xl")}>
                      {t.role}
                    </h3>
                    <p className={cn("mt-2 text-fg/70", major ? "text-lg md:text-xl" : "")}>{t.org}</p>
                    {t.tag && (
                      <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/[0.06] px-3 py-1 font-mono text-[11px] tracking-wide text-accent">
                        <span className="size-1.5 rounded-full bg-accent" />
                        {t.tag}
                      </span>
                    )}
                    {t.meta && <p className="mt-6 max-w-2xl leading-relaxed text-muted">{t.meta}</p>}
                    {t.bullets && (
                      <ul className="mt-8 space-y-4 border-t border-line pt-8">
                        {t.bullets.map((b, j) => (
                          <li key={b} className="grid grid-cols-[2.25rem_1fr] text-[15px] leading-relaxed text-fg/80">
                            <span className="pt-0.5 font-mono text-[11px] text-faint">{pad(j + 1)}</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {t.stack && (
                      <ul className="mt-8 flex flex-wrap gap-2">
                        {t.stack.map((s) => (
                          <li key={s} className="chip">
                            <SkillIcon name={s} size={14} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

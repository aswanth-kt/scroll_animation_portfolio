"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion, hasFinePointer } from "@/lib/gsap";
import { projects, site, type Project } from "@/data/content";
import { pad } from "@/lib/utils";
import SectionHeading from "@/components/ui/SectionHeading";
import BrandIcon from "@/components/ui/BrandIcon";
import SkillIcon from "@/components/ui/SkillIcon";
import Magnetic from "@/components/ui/Magnetic";
import RollText from "@/components/ui/RollText";
import { ArrowUpRight, Check } from "@/components/ui/Icons";

function Visual({ p, index }: { p: Project; index: number }) {
  const host = new URL(p.links.live).host;
  return (
    <div
      data-visual
      className="relative h-full min-h-[300px] overflow-hidden [perspective:1400px] sm:min-h-[420px]"
      style={{
        background: `radial-gradient(110% 90% at 100% 0%, ${p.accent}50, transparent 58%), radial-gradient(90% 80% at 0% 100%, ${p.accent}24, transparent 60%), #141210`,
      }}
    >
      <span aria-hidden="true" className="absolute top-5 right-7 text-[clamp(5rem,11vw,10rem)] leading-none font-medium tracking-[-0.06em] text-white/[0.06]">
        {pad(index + 1)}
      </span>
      <a
        href={p.links.live}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="Visit ↗"
        className="group/frame absolute inset-x-6 top-16 -bottom-8 block sm:inset-x-10 sm:top-20 lg:inset-x-12"
      >
        <div
          data-tilt
          className="h-full overflow-hidden rounded-t-2xl border border-white/10 bg-[#1a1816] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] transition-transform duration-700 ease-[var(--ease-expo)] will-change-transform group-hover/frame:-translate-y-2"
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="size-2 rounded-full bg-white/20" />
            <span className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md bg-white/[0.06] px-3 py-1 font-mono text-[10px] whitespace-nowrap text-white/55">
              <span className="size-1.5 shrink-0 rounded-full" style={{ background: p.accent }} />
              <span className="truncate">{host}</span>
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={`${p.name} — ${p.category} web app built by Aswanth K T`}
            loading="lazy"
            decoding="async"
            width={1280}
            height={800}
            className="block h-[calc(100%-41px)] w-full origin-top object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover/frame:scale-[1.03]"
          />
        </div>
      </a>
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const wraps = gsap.utils.toArray<HTMLElement>("[data-wrap]", root.current);
      const mm = gsap.matchMedia();

      // Stacking: each card recedes as the next one slides over it (desktop).
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        wraps.forEach((wrap, i) => {
          const next = wraps[i + 1];
          if (!next) return;
          const card = wrap.querySelector("[data-card]");
          const dim = wrap.querySelector("[data-dim]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 15%", scrub: true },
          });
          tl.to(card, { scale: 0.9 + i * 0.012, ease: "none" }, 0).to(dim, { opacity: 0.6, ease: "none" }, 0);
        });
      });

      if (!prefersReducedMotion()) {
        wraps.forEach((wrap) => {
          gsap.from(wrap.querySelectorAll("[data-in]"), {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.06,
            scrollTrigger: { trigger: wrap, start: "top 75%", once: true },
          });
        });
      }

      // Pointer tilt on the browser mockups.
      const cleanups: (() => void)[] = [];
      if (hasFinePointer() && !prefersReducedMotion()) {
        gsap.utils.toArray<HTMLElement>("[data-visual]", root.current).forEach((v) => {
          const frame = v.querySelector<HTMLElement>("[data-tilt]")!;
          const rx = gsap.quickTo(frame, "rotationX", { duration: 0.8, ease: "power3.out" });
          const ry = gsap.quickTo(frame, "rotationY", { duration: 0.8, ease: "power3.out" });
          const move = (e: PointerEvent) => {
            const r = v.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 8);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 6);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          v.addEventListener("pointermove", move);
          v.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            v.removeEventListener("pointermove", move);
            v.removeEventListener("pointerleave", leave);
          });
        });
      }
      return () => {
        mm.revert();
        cleanups.forEach((c) => c());
      };
    },
    { scope: root },
  );

  return (
    <section id="work" ref={root} className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading index="04" label="Selected work" aside="Five full-stack apps — each designed, built and deployed end to end. Live links included.">
          Production-minded <em className="serif text-accent">builds.</em>
        </SectionHeading>

        <div className="flex flex-col gap-6 lg:gap-0">
          {projects.map((p, i) => (
            <div key={p.slug} data-wrap className="lg:sticky lg:pb-10" style={{ top: `calc(11vh + ${i * 14}px)` }}>
              <article
                data-card
                className="relative grid origin-top overflow-hidden rounded-[28px] border border-line bg-surface will-change-transform lg:min-h-[76vh] lg:grid-cols-12 lg:rounded-[36px]"
              >
                <div className="flex flex-col justify-between gap-10 p-6 sm:p-10 lg:col-span-5 lg:p-12">
                  <div>
                    <div data-in className="flex items-center justify-between eyebrow">
                      <span>
                        <span className="text-accent">{pad(i + 1)}</span> / {pad(projects.length)}
                      </span>
                      <span>{p.category}</span>
                    </div>
                    <h3 data-in className="mt-8 text-[clamp(2.2rem,3.8vw,3.75rem)] leading-[0.98] font-medium tracking-[-0.045em]">
                      {p.name}
                    </h3>
                    <p data-in className="mt-5 leading-relaxed text-fg/75">
                      {p.description}
                    </p>
                    <ul data-in className="mt-7 space-y-2.5">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-[15px] leading-snug text-fg/85">
                          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full" style={{ background: `${p.accent}26`, color: p.accent }}>
                            <Check size={12} strokeWidth={2.4} />
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div data-in className="space-y-7">
                    <ul className="flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <li key={s} className="chip px-2.5 py-1 text-[10.5px]">
                          <SkillIcon name={s} size={13} />
                          {s}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-3">
                      <Magnetic>
                        <a href={p.links.live} target="_blank" rel="noopener noreferrer" className="btn btn-accent group">
                          <RollText text="Live site" />
                          <ArrowUpRight size={16} />
                        </a>
                      </Magnetic>
                      <Magnetic>
                        <a href={p.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost group">
                          <BrandIcon name="GitHub" size={15} />
                          <RollText text="Source" />
                        </a>
                      </Magnetic>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7">
                  <Visual p={p} index={i} />
                </div>
                <div data-dim aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />
              </article>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-line pt-10 sm:flex-row sm:items-center">
          <p className="max-w-md text-muted">More experiments, bootcamp builds and machine tasks live on GitHub.</p>
          <Magnetic>
            <a href={site.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost group">
              <BrandIcon name="GitHub" size={16} />
              <RollText text="github.com/aswanth-kt" />
              <ArrowUpRight size={16} />
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

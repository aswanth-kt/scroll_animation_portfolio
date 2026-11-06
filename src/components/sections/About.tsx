"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site, stats } from "@/data/content";
import AsciiPortrait from "./AsciiPortrait";
import RollingNumber from "@/components/ui/RollingNumber";
import Magnetic from "@/components/ui/Magnetic";
import RollText from "@/components/ui/RollText";
import { ArrowUpRight } from "@/components/ui/Icons";

export default function About() {
  const root = useRef<HTMLElement>(null);
  const [counted, setCounted] = useState(false);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      ScrollTrigger.create({
        trigger: root.current!.querySelector("[data-stats]"),
        start: "top 85%",
        once: true,
        onEnter: () => setCounted(true),
      });
      if (reduce) return;

      const statement = root.current!.querySelector<HTMLElement>("[data-statement]")!;
      SplitText.create(statement, {
        type: "words",
        aria: "none", // words stay readable as normal text; aria-label isn't allowed on <p>
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.5 }, // dim, but every word (gold included) still passes 3:1 large-text contrast
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 45%", scrub: true },
            },
          ),
      });

      gsap.from(root.current!.querySelector("[data-portrait]"), {
        clipPath: "inset(18% 18% 18% 18% round 28px)",
        scale: 1.08,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-portrait]", start: "top 80%", once: true },
      });
      gsap.from(root.current!.querySelectorAll("[data-fact]"), {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-facts]", start: "top 85%", once: true },
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative pt-28 pb-16 md:pt-40 md:pb-20">
      <div className="container-x">
        <div className="mb-12 flex items-center gap-4 md:mb-16">
          <span className="eyebrow">
            <span className="text-accent">(01)</span>
            <span className="ml-3">About</span>
          </span>
          <span className="h-px flex-1 bg-line" />
          <span className="eyebrow hidden sm:inline">Blueprint discipline → Software delivery</span>
        </div>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="sr-only">About Aswanth K T</h2>
            <p data-statement className="text-[clamp(1.9rem,3.6vw,3.4rem)] leading-[1.08] font-medium tracking-[-0.035em] text-balance">
              I spent four and a half years supervising live railway construction, where one mistake is never small. It
              taught me ownership, planning and a <em className="serif text-accent">zero-error mindset</em> — and I bring
              exactly that to the web: clean APIs, protected routes and full-stack apps that{" "}
              <em className="serif text-accent">hold up in production.</em>
            </p>

            <div data-facts className="mt-14 grid gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2">
              <div data-fact>
                <p className="eyebrow mb-3 flex items-center gap-2">
                  <span className="size-1.5 animate-pulse-dot rounded-full bg-accent" />
                  Currently
                </p>
                <p className="leading-relaxed text-fg/85">
                  {site.role} at <span className="text-fg">{site.company}</span>, which I joined in August 2026.
                </p>
              </div>
              <div data-fact>
                <p className="eyebrow mb-3">Previously</p>
                <p className="leading-relaxed text-fg/85">
                  Built a gym management platform at <span className="text-fg">Hall Dot X</span> — onboarding, subscription
                  billing, attendance, dashboards and WhatsApp automation.
                </p>
              </div>
              <div data-fact>
                <p className="eyebrow mb-3">Before tech</p>
                <p className="leading-relaxed text-fg/85">
                  Crews, heavy machinery, billing reports and live track-changing work at{" "}
                  <span className="text-fg">L&amp;T Construction</span> — with zero safety incidents.
                </p>
              </div>
              <div data-fact>
                <p className="eyebrow mb-3">Based in</p>
                <p className="text-fg/85">{site.location}</p>
              </div>
              <div data-fact>
                <p className="eyebrow mb-3">Speaks</p>
                <p className="text-fg/85">{site.languages.join(" · ")}</p>
              </div>
              <div data-fact className="flex flex-wrap gap-3 sm:col-span-2">
                <Magnetic>
                  <a href={site.links.resume} target="_blank" rel="noopener noreferrer" className="btn btn-accent group">
                    <RollText text="Read my résumé" />
                    <ArrowUpRight size={16} />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#contact" className="btn btn-ghost group">
                    <RollText text="Get in touch" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          <figure className="lg:col-span-5 lg:pl-6">
            <div data-portrait className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] border border-line bg-surface">
              <AsciiPortrait src="/profile.webp" alt="Portrait of Aswanth K T, Full Stack Developer from Kannur, Kerala" className="size-full" />
              <span className="pointer-events-none absolute top-4 left-4 eyebrow text-fg/70">Fig. 01</span>
            </div>
            <figcaption className="mt-4 flex justify-between eyebrow">
              <span>Aswanth K.T — rendered in ASCII</span>
              <span className="hidden text-accent [@media(hover:hover)]:inline">Hover to develop</span>
            </figcaption>
          </figure>
        </div>

        <dl data-stats className="mt-24 grid grid-cols-2 border-t border-line md:mt-32 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col justify-between gap-8 border-b border-line py-8 pr-6 max-lg:even:border-l max-lg:even:pl-6 lg:border-b-0 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0">
              <dt className="order-2 max-w-[16rem] text-sm leading-snug text-muted">{s.label}</dt>
              <dd className="order-1 flex items-start text-[clamp(3.5rem,7vw,6.5rem)] leading-none font-medium tracking-[-0.05em]">
                <RollingNumber value={counted ? s.value : s.from} duration={1.6} stagger={0.12} delay={i * 0.12} />
                {s.suffix && <span className="mt-[0.1em] ml-1 text-[0.32em] tracking-tight text-accent">{s.suffix}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

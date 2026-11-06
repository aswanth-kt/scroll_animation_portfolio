"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { introDone } from "@/lib/bus";
import { chapters, site } from "@/data/content";
import { BEATS, FRAME_COUNT, drawCover, loadFrames } from "./frames";
import LocalClock from "@/components/ui/LocalClock";
import Magnetic from "@/components/ui/Magnetic";
import RollText from "@/components/ui/RollText";
import { ArrowDown, ArrowUpRight } from "@/components/ui/Icons";

/** Where each chapter starts on the route bar (0..1 of the pinned scroll). */
const STATIONS = [0, 0.3, 0.65];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useGSAP(
    () => {
      const section = root.current!;
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const q = gsap.utils.selector(section);
      const reduce = prefersReducedMotion();
      const frames = loadFrames();
      // Stream the full film once the visitor engages. On larger screens also start
      // shortly after the intro; on phones / data-saver wait for a real scroll.
      const resume = () => frames.resume();
      const engage = ["wheel", "touchstart", "keydown", "pointerdown", "scroll"] as const;
      engage.forEach((ev) => window.addEventListener(ev, resume, { once: true, passive: true }));
      let idle = 0;
      const autoStream = frames.count === FRAME_COUNT;
      const unsubIdle = introDone.subscribe((done) => {
        if (done && autoStream) idle = window.setTimeout(resume, 2500);
      });

      // ---------- canvas ----------
      const state = { frame: 0 };
      let drawn: HTMLImageElement | null = null;
      let size = { w: 0, h: 0 };
      const focusFor = (f: number) => gsap.utils.clamp(0.36, 0.5, gsap.utils.mapRange(180, 215, 0.5, 0.36, f));

      const render = (force = false) => {
        const img = frames.get(state.frame);
        if (!img || (!force && img === drawn)) return;
        drawn = img;
        drawCover(ctx, img, size.w, size.h, focusFor(state.frame));
        section.dataset.ready = "true";
      };
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        size = { w: Math.round(canvas.clientWidth * dpr), h: Math.round(canvas.clientHeight * dpr) };
        canvas.width = size.w;
        canvas.height = size.h;
        render(true);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);
      // Keep upgrading to the exact frame as more of the sequence streams in.
      const poll = window.setInterval(() => render(), 200);

      // ---------- intro (plays when the preloader lifts) ----------
      const name = section.querySelector("h1")!;
      const split = SplitText.create(name, { type: "chars" });
      const introItems = q("[data-intro]");

      const intro = gsap.timeline({ paused: true });
      if (!reduce) {
        gsap.set(split.chars, { yPercent: 130 });
        gsap.set(introItems, { autoAlpha: 0, y: 24 });
        intro
          .to(split.chars, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.045 })
          .to(introItems, { autoAlpha: 1, y: 0, duration: 1.1, ease: "expo.out", stagger: 0.07 }, 0.35)
          .from(canvas, { scale: 1.18, duration: 2.4, ease: "expo.out" }, 0);
      }
      const play = (done: boolean) => done && intro.play();
      play(introDone.get());
      const unsub = introDone.subscribe(play);

      if (reduce) {
        // Static poster only — never stream the rest of the film.
        unsubIdle();
        window.clearTimeout(idle);
        engage.forEach((ev) => window.removeEventListener(ev, resume));
        return () => {
          unsub();
          ro.disconnect();
          window.clearInterval(poll);
          frames.destroy();
          split.revert();
        };
      }

      // ---------- scroll story ----------
      const caps = q("[data-chapter]");
      const dots = q("[data-station]");
      const chainage = section.querySelector<HTMLElement>("[data-chainage]")!;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight * (isMobile ? 2.6 : 3.4)}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            chainage.textContent = (p * 4.5).toFixed(3).replace(".", "+");
            dots.forEach((d, i) => (d.dataset.on = String(p >= STATIONS[i] + 0.01 || (i === 0 && p > 0.02))));
          },
        },
      });

      tl.to(state, { frame: BEATS.trackEnd, duration: 3, onUpdate: () => render() }, 0)
        .to(state, { frame: BEATS.switchEnd, duration: 3.5, onUpdate: () => render() }, 3)
        .to(state, { frame: BEATS.last, duration: 3.5, onUpdate: () => render() }, 6.5)
        .to(q("[data-hero-intro]"), { autoAlpha: 0, y: -80, duration: 1.1, ease: "power2.in" }, 0.15)
        .to(q("[data-shade]"), { autoAlpha: 1, duration: 0.8 }, 0.6)
        .to(q("[data-route-fill]"), { scaleX: 1, duration: 10 }, 0);

      const windows: [number, number][] = [
        [0.9, 2.7],
        [3.5, 5.9],
        [6.9, 10],
      ];
      caps.forEach((cap, i) => {
        const [inAt, outAt] = windows[i];
        const lines = cap.querySelectorAll("[data-line]");
        tl.fromTo(lines, { autoAlpha: 0, yPercent: 60 }, { autoAlpha: 1, yPercent: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" }, inAt);
        if (outAt < 10) tl.to(lines, { autoAlpha: 0, yPercent: -50, duration: 0.5, stagger: 0.06, ease: "power2.in" }, outAt);
      });

      // Start of the pinned range should match the rest of the page.
      ScrollTrigger.refresh();

      return () => {
        unsub();
        ro.disconnect();
        window.clearInterval(poll);
        unsubIdle();
        window.clearTimeout(idle);
        engage.forEach((ev) => window.removeEventListener(ev, resume));
        frames.destroy();
        split.revert();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="home"
      ref={root}
      data-ready="false"
      aria-label="Introduction"
      className="group/hero relative h-svh min-h-[580px] w-full overflow-hidden bg-bg"
    >
      {/* Poster shows until the canvas has drawn its first frame (and without JS). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/frames/desktop/0001.jpg"
        alt=""
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover transition-opacity duration-700 group-data-[ready=true]/hero:opacity-0"
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full origin-center" />

      {/* Legibility shading */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgb(var(--bg-rgb)/0.65)_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-bg/90 via-bg/45 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-bg via-bg/60 to-transparent" />
      <div
        data-shade
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 bg-gradient-to-r from-bg/90 via-bg/45 to-transparent opacity-0 max-md:bg-gradient-to-b max-md:from-bg/85 max-md:via-bg/50"
      />

      {/* Top meta row */}
      <div className="container-x absolute inset-x-0 top-24 flex items-start justify-between gap-4 eyebrow">
        <span data-intro className="flex flex-col gap-1">
          <span className="text-fg">{site.role}</span>
          <span className="text-fg/70">@ {site.companyShort} · {site.stack}</span>
        </span>
        <span data-intro className="flex flex-col items-end gap-1 text-right">
          <span className="text-fg">{site.city}</span>
          <LocalClock className="text-fg/70" />
        </span>
      </div>

      {/* Scroll chapters */}
      <div className="container-x pointer-events-none absolute inset-0 flex items-start pt-[30svh] md:items-center md:pt-0">
        {chapters.map((c) => (
          <article key={c.id} data-chapter className="absolute max-w-[min(34rem,88vw)]">
            <p data-line className="invisible mb-4 eyebrow">
              <span className="text-accent">{c.chainage}</span> · {c.period}
            </p>
            <h2 data-line className="invisible serif text-[clamp(3.6rem,9vw,9rem)] leading-[0.9] tracking-[-0.02em]">
              {c.title}
            </h2>
            <p data-line className="invisible mt-5 text-lg leading-relaxed text-fg/85 md:text-xl">
              {c.body}
            </p>
          </article>
        ))}
      </div>

      {/* Name + intro */}
      <div data-hero-intro className="container-x absolute inset-x-0 bottom-20 md:bottom-24">
        <p data-intro className="mb-5 flex items-center gap-2.5 eyebrow text-fg">
          <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
          {site.availability}
        </p>
        <h1 className="-ml-[0.06em] overflow-hidden py-[0.06em] text-[clamp(4.2rem,16.8vw,17.5rem)] leading-[0.86] font-medium tracking-[-0.06em] whitespace-nowrap">
          Aswanth K.T
        </h1>
        <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
          <p data-intro className="max-w-xl text-lg leading-snug text-fg/85 md:text-2xl md:leading-snug">
            Full-stack MERN developer — <em className="serif text-accent">from building railways</em> to building production web apps.
          </p>
          <div data-intro className="flex flex-wrap gap-3">
            <Magnetic>
              <a href="#work" className="btn btn-accent group">
                <RollText text="Selected work" />
                <ArrowDown size={16} />
              </a>
            </Magnetic>
            <Magnetic>
              <a href={site.links.resume} target="_blank" rel="noopener noreferrer" className="btn btn-ghost group">
                <RollText text="Résumé" />
                <ArrowUpRight size={16} />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* Route progress */}
      <div data-intro className="container-x absolute inset-x-0 bottom-6 flex items-center gap-4 eyebrow md:bottom-8">
        <span className="hidden items-center gap-2 sm:flex">
          <ArrowDown size={13} className="animate-bounce" />
          Scroll to explore
        </span>
        <div className="relative h-px flex-1 bg-line-strong">
          <div data-route-fill className="absolute inset-0 origin-left scale-x-0 bg-accent" />
          {chapters.map((c, i) => (
            <span
              key={c.id}
              data-station
              data-on="false"
              className="group/st absolute top-1/2 -translate-1/2"
              style={{ left: `${STATIONS[i] * 100}%` }}
            >
              <span className="block size-2.5 rounded-full border border-fg/60 bg-bg transition-colors duration-300 group-data-[on=true]/st:border-accent group-data-[on=true]/st:bg-accent" />
              <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 whitespace-nowrap transition-colors group-data-[on=true]/st:text-fg sm:block">
                {c.title.replace(".", "")}
              </span>
            </span>
          ))}
        </div>
        <span className="hidden tabular-nums sm:inline">
          CH <span data-chainage>0+000</span>
        </span>
        <a
          href="#about"
          className="pointer-events-auto -my-2 rounded-full border border-line-strong bg-bg/50 px-3 py-2 text-fg backdrop-blur transition-colors hover:border-accent hover:text-accent"
        >
          Skip intro ↓
        </a>
      </div>
    </section>
  );
}

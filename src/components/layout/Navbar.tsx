"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/data/content";
import { paletteOpen } from "@/lib/bus";
import { cn } from "@/lib/utils";
import RollText from "@/components/ui/RollText";
import Magnetic from "@/components/ui/Magnetic";
import BrandIcon from "@/components/ui/BrandIcon";
import { ArrowUpRight, Search } from "@/components/ui/Icons";
import { setScrollLocked } from "./SmoothScroll";

function useShortcutLabel() {
  const [label, setLabel] = useState("⌘K");
  useEffect(() => {
    if (!/Mac|iPhone|iPad/i.test(navigator.userAgent)) setLabel("Ctrl K");
  }, []);
  return label;
}

export default function Navbar() {
  const bar = useRef<HTMLElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);
  const shortcut = useShortcutLabel();

  // Hide on scroll down, reveal on scroll up; track the active section.
  useGSAP(() => {
    const el = bar.current!;
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      refreshPriority: -1,
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > 240;
        el.dataset.hidden = hide ? "true" : "false";
        el.dataset.scrolled = self.scroll() > 40 ? "true" : "false";
      },
    });
    const sections = nav.map(({ href }) =>
      ScrollTrigger.create({
        trigger: href,
        start: "top 55%",
        end: "bottom 55%",
        refreshPriority: -1,
        onToggle: (self) => self.isActive && setActive(href),
        onLeaveBack: () => href === nav[0].href && setActive(""),
      }),
    );
    return () => {
      st.kill();
      sections.forEach((s) => s.kill());
    };
  });

  // Slide the highlight under the active link.
  useLayoutEffect(() => {
    const ind = indicator.current;
    const link = pill.current?.querySelector<HTMLElement>(`[data-href="${active}"]`);
    if (!ind) return;
    if (!link) {
      gsap.to(ind, { autoAlpha: 0, duration: 0.3 });
      return;
    }
    gsap.to(ind, {
      autoAlpha: 1,
      x: link.offsetLeft,
      width: link.offsetWidth,
      duration: 0.6,
      ease: "expo.out",
    });
  }, [active]);

  // Fullscreen mobile menu.
  useEffect(() => {
    setScrollLocked(open, "menu");
    const el = menu.current;
    if (!el) return;
    if (open) {
      el.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
      if (!prefersReducedMotion()) {
        gsap.fromTo(el.querySelectorAll("[data-menu-item]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.05, delay: 0.15 });
      }
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        ref={bar}
        data-hidden="false"
        data-scrolled="false"
        className={cn(
          "fixed inset-x-0 top-0 z-[80] transition-transform duration-500 ease-[var(--ease-expo)]",
          !open && "data-[hidden=true]:-translate-y-full",
        )}
      >
        <nav aria-label="Primary" className="container-x flex h-20 items-center justify-between gap-4">
          <a href="#home" className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight">
            <span className="sr-only">Aswanth K.T — back to top</span>
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-full bg-fg text-[11px] font-bold tracking-tighter text-bg transition-colors duration-300 group-hover:bg-accent">
              AKT
            </span>
            <span className="hidden sm:block" aria-hidden="true">
              <RollText text={site.name} />
            </span>
          </a>

          <div
            ref={pill}
            className="relative hidden items-center rounded-full border border-line bg-bg/55 p-1 backdrop-blur-xl lg:flex"
          >
            <span ref={indicator} className="invisible absolute top-1 bottom-1 left-0 rounded-full bg-fg/10 opacity-0" aria-hidden="true" />
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className="group relative rounded-full px-4 py-2 text-[13px] text-fg/75 transition-colors hover:text-fg aria-[current]:text-fg"
              >
                <RollText text={item.label} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => paletteOpen.set(true)}
              className="group flex h-10 items-center gap-2 rounded-full border border-line bg-bg/55 px-3.5 text-[13px] text-fg/75 backdrop-blur-xl transition-colors hover:border-line-strong hover:text-fg"
            >
              <Search size={15} />
              <span className="sr-only">Search or jump to — </span>
              <kbd className="hidden font-mono text-[11px] tracking-wider sm:inline">{shortcut}</kbd>
            </button>
            <span className="hidden md:block">
              <Magnetic>
                <a href="#contact" className="btn btn-accent group h-10 py-0 text-[13px]">
                  <RollText text="Let's talk" />
                </a>
              </Magnetic>
            </span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="relative grid size-10 place-items-center rounded-full border border-line bg-bg/55 backdrop-blur-xl lg:hidden"
            >
              <span className={cn("absolute h-px w-4 bg-fg transition-transform duration-500", open ? "rotate-45" : "-translate-y-[3px]")} />
              <span className={cn("absolute h-px w-4 bg-fg transition-transform duration-500", open ? "-rotate-45" : "translate-y-[3px]")} />
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        ref={menu}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-0 z-[70] flex flex-col justify-between bg-bg px-5 pt-28 pb-8 sm:px-8 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <a
                data-menu-item
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-1 text-[clamp(2.75rem,12vw,5rem)] leading-[1.05] font-medium tracking-[-0.04em]"
              >
                <span className="font-mono text-xs tracking-widest text-accent">0{i + 1}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="overflow-hidden">
          <div data-menu-item className="flex flex-col gap-5 border-t border-line pt-6">
            <a href={`mailto:${site.email}`} className="text-lg">
              {site.email}
            </a>
            <div className="flex gap-3">
              {[
                ["GitHub", site.links.github],
                ["LinkedIn", site.links.linkedin],
                ["WhatsApp", site.links.whatsapp],
              ].map(([name, href]) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={name} className="grid size-11 place-items-center rounded-full border border-line">
                  <BrandIcon name={name} size={16} />
                </a>
              ))}
              <a href={site.links.resume} target="_blank" rel="noopener noreferrer" className="btn btn-ghost ml-auto h-11 py-0">
                Resume <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

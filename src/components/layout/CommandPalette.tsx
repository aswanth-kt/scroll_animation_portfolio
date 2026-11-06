"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { copyToClipboard, paletteOpen } from "@/lib/bus";
import { nav, projects, site } from "@/data/content";
import { cn } from "@/lib/utils";
import { scrollToTarget, setScrollLocked } from "./SmoothScroll";
import BrandIcon from "@/components/ui/BrandIcon";
import { ArrowUpRight, Copy, FileText, Hash, Mail, Search } from "@/components/ui/Icons";

type Action = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  icon: ReactNode;
  run: () => void;
};

const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  const actions = useMemo<Action[]>(
    () => [
      { id: "home", group: "Navigate", label: "Home", icon: <Hash size={16} />, run: () => scrollToTarget(0) },
      ...nav.map((n) => ({
        id: n.href,
        group: "Navigate",
        label: n.label,
        icon: <Hash size={16} />,
        run: () => scrollToTarget(n.href),
      })),
      { id: "copy", group: "Contact", label: "Copy email address", hint: site.email, keywords: "mail", icon: <Copy size={16} />, run: () => copyToClipboard(site.email, "Email copied to clipboard") },
      { id: "mail", group: "Contact", label: "Send an email", keywords: "mail write", icon: <Mail size={16} />, run: () => (window.location.href = `mailto:${site.email}`) },
      { id: "wa", group: "Contact", label: "Message on WhatsApp", keywords: "chat phone", icon: <BrandIcon name="WhatsApp" size={15} />, run: () => open(site.links.whatsapp) },
      { id: "resume", group: "Links", label: "View résumé", keywords: "cv resume pdf", icon: <FileText size={16} />, run: () => open(site.links.resume) },
      { id: "gh", group: "Links", label: "GitHub", hint: "@aswanth-kt", keywords: "code source", icon: <BrandIcon name="GitHub" size={15} />, run: () => open(site.links.github) },
      { id: "li", group: "Links", label: "LinkedIn", keywords: "profile", icon: <BrandIcon name="LinkedIn" size={15} />, run: () => open(site.links.linkedin) },
      ...projects.map((p) => ({
        id: p.slug,
        group: "Projects",
        label: `Open ${p.name}`,
        hint: "Live ↗",
        keywords: `${p.category} ${p.stack.join(" ")}`,
        icon: <ArrowUpRight size={16} />,
        run: () => open(p.links.live),
      })),
    ],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.label} ${a.group} ${a.keywords ?? ""} ${a.hint ?? ""}`.toLowerCase().includes(q));
  }, [actions, query]);

  // Open / close from anywhere.
  useEffect(() => {
    const unsub = paletteOpen.subscribe(setIsOpen);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        paletteOpen.set(!paletteOpen.get());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      unsub();
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const page = document.getElementById("page");
    if (isOpen) {
      restoreFocus.current = document.activeElement as HTMLElement;
      setQuery("");
      setIndex(0);
      setScrollLocked(true, "palette");
      page?.setAttribute("inert", "");
      requestAnimationFrame(() => input.current?.focus());
      gsap.fromTo(panel.current, { autoAlpha: 0, y: 16, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "expo.out" });
    } else if (restoreFocus.current) {
      page?.removeAttribute("inert");
      setScrollLocked(false, "palette");
      restoreFocus.current.focus?.({ preventScroll: true });
      restoreFocus.current = null;
    }
  }, [isOpen]);

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${index}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const close = () => paletteOpen.set(false);
  const run = (a?: Action) => {
    if (!a) return;
    close();
    // Let the scroll lock release before navigating.
    setTimeout(a.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(filtered[index]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[140] flex items-start justify-center px-4 pt-[14vh]" onKeyDown={onKeyDown}>
      <button type="button" aria-label="Close command menu" tabIndex={-1} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-line-strong bg-raised/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <Search size={18} className="text-muted" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[index] ? `cmd-${filtered[index].id}` : undefined}
            className="h-16 w-full bg-transparent text-base text-fg outline-none placeholder:text-faint"
          />
          <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">ESC</kbd>
        </div>
        <ul ref={list} id="palette-list" role="listbox" data-lenis-prevent className="no-scrollbar max-h-[min(420px,55vh)] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted">No results for “{query}”</li>}
          {filtered.map((a, i) => {
            const header = a.group !== lastGroup ? a.group : null;
            lastGroup = a.group;
            return (
              <li key={a.id} role="presentation">
                {header && <div className="px-3 pt-3 pb-1.5 font-mono text-[10px] tracking-[0.18em] text-faint uppercase">{header}</div>}
                <div
                  id={`cmd-${a.id}`}
                  role="option"
                  aria-selected={i === index}
                  data-index={i}
                  onMouseMove={() => setIndex(i)}
                  onClick={() => run(a)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    i === index ? "bg-fg/[0.08] text-fg" : "text-fg/75",
                  )}
                >
                  <span className={cn("grid size-8 place-items-center rounded-lg border border-line", i === index && "border-accent/50 text-accent")}>{a.icon}</span>
                  <span className="flex-1">{a.label}</span>
                  {a.hint && <span className="font-mono text-[11px] text-muted">{a.hint}</span>}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-4 border-t border-line px-5 py-3 font-mono text-[10px] tracking-wider text-faint uppercase">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span className="ml-auto">AKT / cmd</span>
        </div>
      </div>
    </div>
  );
}

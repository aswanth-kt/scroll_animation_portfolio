import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 border-b border-line/30 transition ${scrolled ? "bg-ink/90 backdrop-blur" : "bg-ink/60"}`} aria-label="Primary navigation">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="font-display text-xl font-bold text-paper focus-ring">
          AK<span className="text-signal">.</span>
        </a>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper/70 transition hover:text-paper focus-ring">
              {label}
            </a>
          ))}
        </div>
        <button type="button" className="focus-ring grid h-10 w-10 place-items-center border border-line/50 text-paper md:hidden" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && (
        <div className="border-t border-line/30 bg-ink px-4 py-4 md:hidden">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="block py-3 font-display text-sm uppercase tracking-[0.14em] text-paper focus-ring" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

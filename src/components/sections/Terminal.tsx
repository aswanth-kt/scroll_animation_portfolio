"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { projects, site, skills, timeline } from "@/data/content";
import { scrollToTarget } from "@/components/layout/SmoothScroll";
import { copyToClipboard } from "@/lib/bus";

type Line = { id: number; kind: "in" | "out"; content: ReactNode };

const PROMPT = (
  <>
    <span className="text-accent">visitor@aswanth</span>
    <span className="text-faint">:</span>
    <span className="text-holo">~</span>
    <span className="text-faint">$</span>
  </>
);

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-holo underline decoration-holo/40 underline-offset-4 hover:decoration-holo">
    {children}
  </a>
);

const COMMANDS: Record<string, { desc: string; run: (args: string[]) => ReactNode }> = {
  help: {
    desc: "List available commands",
    run: () => (
      <div className="grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-0.5">
        {Object.entries(COMMANDS)
          .filter(([k]) => !HIDDEN.has(k))
          .map(([name, c]) => (
            <div key={name} className="contents">
              <span className="text-accent">{name}</span>
              <span className="text-muted">{c.desc}</span>
            </div>
          ))}
      </div>
    ),
  },
  whoami: {
    desc: "Who is Aswanth?",
    run: () => (
      <p>
        {site.name} — {site.role} ({site.stack}) at {site.company}, {site.location}. Previously MERN Stack Developer at Hall Dot X;
        before that, a railway site supervisor. {site.availability}.
      </p>
    ),
  },
  stack: {
    desc: "Tech I work with",
    run: () => (
      <div className="space-y-0.5">
        {skills.map((s) => (
          <p key={s.group}>
            <span className="inline-block w-36 text-accent">{s.group}</span>
            <span className="text-fg/80">{s.items.join(", ")}</span>
          </p>
        ))}
      </div>
    ),
  },
  projects: {
    desc: "Things I've shipped",
    run: () => (
      <div className="space-y-1">
        {projects.map((p, i) => (
          <p key={p.slug}>
            <span className="text-faint">0{i + 1}</span> <span className="text-fg">{p.name}</span> <span className="text-muted">— {p.category}</span>{" "}
            <Link href={p.links.live}>live</Link> · <Link href={p.links.github}>code</Link>
          </p>
        ))}
      </div>
    ),
  },
  experience: {
    desc: "Where I've worked",
    run: () => (
      <div className="space-y-0.5">
        {timeline
          .filter((t) => t.kind === "work")
          .map((t) => (
            <p key={t.org}>
              <span className="inline-block w-44 text-muted">{t.period}</span>
              <span className="text-fg">{t.role}</span> <span className="text-accent">@ {t.org}</span>
            </p>
          ))}
      </div>
    ),
  },
  contact: {
    desc: "How to reach me",
    run: () => (
      <div className="space-y-0.5">
        <p>
          email&nbsp;&nbsp;&nbsp;&nbsp;<Link href={`mailto:${site.email}`}>{site.email}</Link>
        </p>
        <p>phone&nbsp;&nbsp;&nbsp;&nbsp;{site.phone}</p>
        <p>
          github&nbsp;&nbsp;&nbsp;<Link href={site.links.github}>github.com/aswanth-kt</Link>
        </p>
        <p>
          linkedin <Link href={site.links.linkedin}>linkedin.com/in/aswanth-kt</Link>
        </p>
      </div>
    ),
  },
  email: {
    desc: "Copy my email address",
    run: () => {
      copyToClipboard(site.email, "Email copied to clipboard");
      return <p>Copied {site.email} to your clipboard.</p>;
    },
  },
  resume: {
    desc: "Open my résumé",
    run: () => {
      window.open(site.links.resume, "_blank", "noopener,noreferrer");
      return <p>Opening résumé in a new tab…</p>;
    },
  },
  hire: {
    desc: "The best command",
    run: () => {
      setTimeout(() => scrollToTarget("#contact"), 700);
      return (
        <p>
          <span className="text-accent">Excellent choice.</span> Routing you to the contact form…
        </p>
      );
    },
  },
  ls: {
    desc: "List files",
    run: () => (
      <p className="flex flex-wrap gap-x-6">
        <span className="text-holo">projects/</span>
        <span className="text-holo">experience/</span>
        <span>about.txt</span>
        <span>resume.pdf</span>
        <span className="text-accent">hire-me.sh</span>
      </p>
    ),
  },
  cat: {
    desc: "Read a file",
    run: ([file]) => {
      if (!file) return <p className="text-muted">usage: cat &lt;file&gt;</p>;
      if (file === "about.txt") return COMMANDS.whoami.run([]);
      if (file === "hire-me.sh") return COMMANDS.hire.run([]);
      if (file === "resume.pdf") return COMMANDS.resume.run([]);
      return <p className="text-muted">cat: {file}: Is a directory, or doesn&apos;t exist. Try `ls`.</p>;
    },
  },
  date: {
    desc: "Local time in Kannur",
    run: () => <p>{new Date().toLocaleString("en-IN", { timeZone: site.timezone, dateStyle: "full", timeStyle: "medium" })} (IST)</p>,
  },
  sudo: {
    desc: "",
    run: () => <p className="text-danger">Permission denied. This incident has been reported to the site supervisor.</p>,
  },
  clear: { desc: "Clear the terminal", run: () => null },
};
const HIDDEN = new Set(["sudo", "cat"]);

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [busy, setBusy] = useState(false);
  const id = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const out = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const execute = (raw: string) => {
    const text = raw.trim();
    const [name, ...args] = text.split(/\s+/);
    const cmd = COMMANDS[name?.toLowerCase() ?? ""];
    if (name?.toLowerCase() === "clear") {
      setLines([]);
      return;
    }
    const result = !text ? null : cmd ? cmd.run(args) : (
      <p className="text-muted">
        command not found: <span className="text-fg">{name}</span>. Type <span className="text-accent">help</span> to see what I can do.
      </p>
    );
    setLines((prev) => [
      ...prev,
      { id: id.current++, kind: "in", content: text },
      ...(result ? [{ id: id.current++, kind: "out" as const, content: result }] : []),
    ]);
    if (text) setHistory((h) => [text, ...h].slice(0, 30));
    setCursor(-1);
  };

  // Type a first command when the terminal scrolls into view.
  useEffect(() => {
    const welcome: Line = {
      id: id.current++,
      kind: "out",
      content: (
        <p className="text-muted">
          AKT shell v2.0 — type <span className="text-accent">help</span>, or try <span className="text-accent">projects</span>,{" "}
          <span className="text-accent">stack</span>, <span className="text-accent">hire</span>.
        </p>
      ),
    };
    setLines([welcome]);
    let timer: ReturnType<typeof setTimeout>;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 70%",
      once: true,
      onEnter: () => {
        const demo = "whoami";
        setBusy(true);
        let i = 0;
        const type = () => {
          i += 1;
          setValue(demo.slice(0, i));
          if (i < demo.length) timer = setTimeout(type, 90);
          else
            timer = setTimeout(() => {
              setValue("");
              execute(demo);
              setBusy(false);
            }, 380);
        };
        timer = setTimeout(type, 500);
      },
    });
    return () => {
      st.kill();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = out.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, value]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (history[next] !== undefined) {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = cursor - 1;
      setCursor(Math.max(next, -1));
      setValue(next >= 0 ? history[next] : "");
    } else if (e.key === "Tab") {
      const match = Object.keys(COMMANDS).find((c) => value && c.startsWith(value.toLowerCase()) && !HIDDEN.has(c));
      if (match) {
        e.preventDefault();
        setValue(match);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      ref={root}
      onClick={() => {
        if (!window.getSelection()?.toString()) input.current?.focus({ preventScroll: true });
      }}
      className="flex h-full flex-col font-mono text-[12.5px] leading-relaxed md:text-[13px]"
    >
      <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] tracking-wider text-muted">aswanth@portfolio — zsh</span>
        <span className="ml-auto hidden rounded-full border border-line px-2 py-0.5 text-[10px] tracking-widest text-faint uppercase sm:inline">
          Interactive
        </span>
      </div>
      {/* Fixed-height output that scrolls inside the box; see data-scroll-nested in SmoothScroll. */}
      <div
        ref={out}
        data-scroll-nested
        tabIndex={0}
        aria-label="Terminal output"
        aria-live="polite"
        className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-5 pt-4 pb-2 [mask-image:linear-gradient(to_bottom,transparent,black_20px)] [@media(pointer:fine)]:overscroll-contain"
      >
        {lines.map((l) =>
          l.kind === "in" ? (
            <p key={l.id} className="break-all">
              {PROMPT} <span className="text-fg">{l.content}</span>
            </p>
          ) : (
            <div key={l.id} className="text-fg/85">
              {l.content}
            </div>
          ),
        )}
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-line px-5 pt-3 pb-2">
        <span className="mr-1 text-[10px] tracking-widest text-faint uppercase">Try</span>
        {["help", "projects", "stack", "experience", "contact", "hire"].map((c) => (
          <button
            key={c}
            type="button"
            disabled={busy}
            onClick={(e) => {
              e.stopPropagation();
              execute(c);
            }}
            className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            {c}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-2 px-5 pt-1 pb-5">
        <span className="shrink-0">{PROMPT}</span>
        <span className="relative flex-1">
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            readOnly={busy}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Terminal command"
            className="w-full bg-transparent text-fg caret-accent outline-none"
          />
        </span>
      </label>
    </div>
  );
}

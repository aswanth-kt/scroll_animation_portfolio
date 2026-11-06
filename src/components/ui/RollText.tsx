import { cn } from "@/lib/utils";

/**
 * Hover effect: the label rolls up letter by letter and a copy rolls in from below.
 * Needs a parent with the `group` class.
 *
 * The rolling letters are drawn with CSS (`.glyph`), so the label exists only once in the
 * page text — copy/paste, search engines and screen readers all get the plain `text`.
 */
export default function RollText({ text, className }: { text: string; className?: string }) {
  const chars = Array.from(text);
  const row = (hiddenClass: string, extra?: string) => (
    <span aria-hidden="true" className={cn("flex", extra)}>
      {chars.map((c, i) => (
        <span
          key={i}
          data-c={c === " " ? " " : c}
          className={cn("glyph inline-block transition-transform duration-500 ease-[var(--ease-expo)]", hiddenClass)}
          style={{ transitionDelay: `${i * 18}ms` }}
        />
      ))}
    </span>
  );
  return (
    <span className={cn("relative inline-flex overflow-hidden leading-[1.15]", className)}>
      <span className="sr-only">{text}</span>
      {row("group-hover:-translate-y-full group-focus-visible:-translate-y-full")}
      {row("translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0", "absolute inset-0")}
    </span>
  );
}

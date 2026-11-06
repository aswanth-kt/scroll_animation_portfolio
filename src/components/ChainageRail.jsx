import { useScrollProgress } from "../hooks/useScrollProgress";

export default function ChainageRail() {
  const progress = useScrollProgress();

  return (
    <>
      <aside className="fixed right-5 top-24 z-40 hidden h-[calc(100vh-8rem)] w-10 md:block" aria-hidden="true">
        <div className="relative h-full border-r border-line/60">
          {Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className={`absolute right-0 h-px ${i % 3 === 0 ? "bg-signal" : "bg-line/70"}`}
              style={{ top: `${i * 9.09}%`, width: i % 3 === 0 ? 28 : 14 }}
            />
          ))}
          <span className="absolute -right-1 h-3 w-3 -translate-y-1/2 border border-signal bg-ink" style={{ top: `${progress * 100}%` }} />
          <span className="absolute -left-1 top-0 -translate-x-full font-display text-[10px] text-line">0+000</span>
          <span className="absolute -bottom-1 -left-1 -translate-x-full font-display text-[10px] text-line">4+500</span>
        </div>
      </aside>
      <div className="fixed left-0 right-0 top-[64px] z-40 h-px bg-line/40 md:hidden" aria-hidden="true">
        <div className="h-full bg-signal" style={{ width: `${progress * 100}%` }} />
      </div>
    </>
  );
}

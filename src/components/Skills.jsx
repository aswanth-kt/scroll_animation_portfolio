import { content } from "../data/content";
import CornerFrame from "./CornerFrame";
import SectionHeader from "./SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="section-pad bg-steel/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="SHEET 02 - SKILLS" title="Specification schedule." kicker="Grouped as working systems rather than loose badges." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(content.skills).map(([group, items], index) => (
            <CornerFrame key={group} className="min-h-64">
              <p className="mb-5 font-display text-sm font-bold uppercase tracking-[0.14em] text-signal">
                SPEC.{String(index + 1).padStart(2, "0")} - {group}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="border border-line/40 px-3 py-2 font-display text-xs text-paper/80">
                    {item}
                  </span>
                ))}
              </div>
            </CornerFrame>
          ))}
        </div>
      </div>
    </section>
  );
}

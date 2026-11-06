import { content } from "../data/content";
import CornerFrame from "./CornerFrame";
import SectionHeader from "./SectionHeader";

export default function Education() {
  return (
    <section id="education" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="SHEET 05 - EDUCATION" title="Training record." />
        <div className="grid gap-5 md:grid-cols-3">
          {content.education.map((item) => (
            <CornerFrame key={`${item.title}-${item.period}`}>
              <p className="font-display text-xs uppercase tracking-[0.14em] text-signal">{item.period}</p>
              <h3 className="mt-4 font-display text-xl font-bold text-paper">{item.title}</h3>
              {item.org && <p className="mt-2 font-semibold text-paper/75">{item.org}</p>}
              {item.note && <p className="mt-4 text-sm leading-6 text-paper/70">{item.note}</p>}
            </CornerFrame>
          ))}
        </div>
      </div>
    </section>
  );
}

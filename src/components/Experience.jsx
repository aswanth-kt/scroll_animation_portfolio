import { content } from "../data/content";
import CornerFrame from "./CornerFrame";
import SectionHeader from "./SectionHeader";

export default function Experience() {
  return (
    <section id="experience" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="SHEET 03 - EXPERIENCE" title="Career chainage." kicker="Two chapters on one measured line: railway build discipline into full-stack delivery." />
        <div className="mb-12 hidden items-center gap-4 font-display text-xs text-paper/70 lg:flex" aria-hidden="true">
          <span>CH 0+000</span>
          <span className="h-px flex-1 bg-line/60" />
          <span className="h-4 w-4 border-2 border-signal bg-ink" />
          <span className="h-px flex-1 bg-line/60" />
          <span className="h-4 w-4 border-2 border-signal bg-ink" />
          <span className="h-px flex-1 bg-line/60" />
          <span>CH 4+500</span>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {content.experience.map((job, index) => (
            <CornerFrame key={`${job.company}-${job.role}`} className="h-full">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-signal">CH {index === 0 ? "4+500" : "0+000"}</p>
              <h3 className="mt-4 font-display text-2xl font-bold text-paper">{job.role}</h3>
              <p className="mt-2 text-lg font-semibold text-paper/90">{job.company}</p>
              <p className="mt-1 font-display text-xs uppercase tracking-[0.12em] text-line">{job.period}</p>
              {job.meta && <p className="mt-4 text-sm leading-6 text-paper/70">{job.meta}</p>}
              <ul className="mt-6 space-y-4 text-sm leading-6 text-paper/75">
                {job.bullets.map((bullet) => (
                  <li key={bullet} className="grid grid-cols-[14px_1fr] gap-3">
                    <span className="mt-2 h-px bg-signal" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </CornerFrame>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SectionHeader({ sheet, title, kicker }) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-signal">{sheet}</p>
      <h2 className="max-w-3xl font-display text-3xl font-bold text-paper md:text-5xl">{title}</h2>
      {kicker && <p className="max-w-2xl text-base leading-7 text-paper/75">{kicker}</p>}
    </div>
  );
}

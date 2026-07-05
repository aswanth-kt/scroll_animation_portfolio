import { content } from "../data/content";

export default function Footer() {
  return (
    <footer className="border-t border-line/40 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-paper/70 md:flex-row md:items-center md:justify-between">
        <p className="font-display uppercase tracking-[0.12em]">Aswanth K.T - Blueprint to Build</p>
        {/* <p>{content.additional.languages.join(" / ")}</p> */}
        <p>© {new Date().getFullYear()} Aswanth K.T. All rights reserved.</p>
      </div>
    </footer>
  );
}

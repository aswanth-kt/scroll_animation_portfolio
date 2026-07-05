import { ArrowDownRight, Download, Eye, Mail } from "lucide-react";
import { content } from "../data/content";
import FrameSequenceCanvas from "./FrameSequenceCanvas";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-16">
      <FrameSequenceCanvas />
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-5 inline-flex items-center gap-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-paper/90">
            <span className="h-2 w-2 bg-signal" />
            Available for full-time roles
          </p>
          <h1 className="font-display text-[clamp(3rem,9vw,8.2rem)] font-bold leading-[0.92] text-paper">
            {content.name}
          </h1>
          <p className="mt-6 font-display text-xl font-semibold text-paper md:text-3xl">{content.title}</p>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-paper/75">
            From live railway construction sites to production web applications: disciplined full-stack development shaped by high-stakes operations leadership.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a className="btn-primary" href="#projects">
              View Projects <ArrowDownRight size={18} />
            </a>
            <a className="btn-secondary" href={content.resume.link} target="_blank" rel="noopener noreferrer">
              View Resume <Eye size={18} />
            </a>
            <a className="btn-secondary" href="#contact">
              Get in Touch <Mail size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

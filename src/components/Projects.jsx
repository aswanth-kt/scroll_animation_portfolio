import { ExternalLink, Github } from "lucide-react";
import { content } from "../data/content";
import CornerFrame from "./CornerFrame";
import SectionHeader from "./SectionHeader";

export default function Projects() {
  return (
    <section id="projects" className="section-pad bg-steel/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="SHEET 04 - PROJECTS" title="Production-minded builds." />
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {content.projects.map((project) => (
            <CornerFrame key={project.name} as="article" className="group flex min-h-[420px] flex-col transition duration-300 hover:-translate-y-1 hover:border-signal/70">
              <h3 className="font-display text-xl font-bold leading-7 text-paper">{project.name}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="border border-line/40 px-2 py-1 font-display text-[11px] text-paper/70">
                    {tech}
                  </span>
                ))}
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm leading-6 text-paper/75">
                {project.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <a href={project.links.live} className="project-link" target="_blank" rel="noopener noreferrer">
                  Live <ExternalLink size={15} />
                </a>
                <a href={project.links.github} className="project-link" target="_blank" rel="noopener noreferrer">
                  GitHub <Github size={15} />
                </a>
              </div>
            </CornerFrame>
          ))}
        </div>
      </div>
    </section>
  );
}

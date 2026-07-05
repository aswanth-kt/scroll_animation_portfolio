import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { content } from "../data/content";
import CornerFrame from "./CornerFrame";
import SectionHeader from "./SectionHeader";

export default function Contact() {
  const mailto = `mailto:${content.email}?subject=Portfolio%20enquiry%20for%20Aswanth%20K.T`;

  return (
    <section id="contact" className="section-pad bg-steel/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="SHEET 06 - CONTACT" title="Sign-off panel." kicker={content.additional.availability} />
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <CornerFrame>
            <dl className="space-y-6">
              <div>
                <dt className="font-display text-xs uppercase tracking-[0.16em] text-line">Name</dt>
                <dd className="mt-1 text-xl font-semibold text-paper">{content.name}</dd>
              </div>
              <div>
                <dt className="font-display text-xs uppercase tracking-[0.16em] text-line">Status</dt>
                <dd className="mt-1 text-paper">{content.additional.availability}</dd>
              </div>
              <div className="space-y-3">
                <a className="contact-link" href={`mailto:${content.email}`}>
                  <Mail size={18} /> {content.email}
                </a>
                <a className="contact-link" href={`tel:${content.phone.replace(/\s/g, "")}`}>
                  <Phone size={18} /> {content.phone}
                </a>
                <p className="contact-link">
                  <MapPin size={18} /> {content.location}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <a className="icon-link" href={content.links.linkedin} aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a className="icon-link" href={content.links.github} aria-label="GitHub">
                  <Github size={18} />
                </a>
              </div>
            </dl>
          </CornerFrame>
          <CornerFrame>
            <form action={mailto} method="post" encType="text/plain" className="grid gap-4">
              <label className="field-label">
                Name
                <input required name="name" className="field" autoComplete="name" />
              </label>
              <label className="field-label">
                Email
                <input required name="email" type="email" className="field" autoComplete="email" />
              </label>
              <label className="field-label">
                Message
                <textarea required name="message" rows="5" className="field resize-none" />
              </label>
              <button className="btn-primary justify-center" type="submit">
                Send Message <Send size={17} />
              </button>
            </form>
          </CornerFrame>
        </div>
      </div>
    </section>
  );
}

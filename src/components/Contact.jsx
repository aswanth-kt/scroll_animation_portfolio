import { Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import { content } from "../data/content";
import CornerFrame from "./CornerFrame";
import SectionHeader from "./SectionHeader";

export default function Contact() {
  const mailto = `mailto:${content.email}?subject=Portfolio%20enquiry%20for%20Aswanth%20K.T`;

  const WhatsAppIcon = ({ size = 22, className = "" }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 11.5C20 16.2 16.2 20 11.5 20a8.4 8.4 0 0 1-3.9-.9L4 20l1-3.5A8.4 8.4 0 0 1 3.5 11.5C3.5 6.8 7.3 3 12 3s8 3.8 8 8.5z"/>
      <path d="M9.3 8.8c-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.3-.2.3-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 3.9 3.4 1.9.8 2.3.6 2.7.6.4-.1 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.4-.2-.9-.5s-1-.5-1.2-.6c-.2-.1-.4-.1-.6.1-.2.2-.6.7-.8.8-.2.1-.3.1-.6 0-.3-.2-1.2-.5-2.2-1.5-.8-.7-1.3-1.6-1.5-1.9-.2-.3 0-.4.1-.6.1-.1.2-.3.4-.4.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.5-1.2-.7-1.6z"/>
    </svg>
  );

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

                <a className="icon-link" href={content.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>

                <a className="icon-link" href={content.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github size={18} />
                </a>

                <a className="icon-link" href={content.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <WhatsAppIcon size={18} />
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

"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/data/content";
import { copyToClipboard } from "@/lib/bus";
import { cn } from "@/lib/utils";
import LocalClock from "@/components/ui/LocalClock";
import Magnetic from "@/components/ui/Magnetic";
import RollText from "@/components/ui/RollText";
import BrandIcon from "@/components/ui/BrandIcon";
import { ArrowUpRight, Copy, FileText, Phone, Send } from "@/components/ui/Icons";

const TOPICS = ["Full-time role", "Freelance project", "Just saying hi"];

type Status = "idle" | "loading" | "success" | "error";

const LINKS = [
  { label: "GitHub", handle: "@aswanth-kt", href: site.links.github, icon: <BrandIcon name="GitHub" size={18} /> },
  { label: "LinkedIn", handle: "in/aswanth-kt", href: site.links.linkedin, icon: <BrandIcon name="LinkedIn" size={18} /> },
  { label: "WhatsApp", handle: "Message me", href: site.links.whatsapp, icon: <BrandIcon name="WhatsApp" size={18} /> },
  { label: "Résumé", handle: "Google Drive", href: site.links.resume, icon: <FileText size={18} /> },
  { label: "Phone", handle: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}`, icon: <Phone size={18} /> },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [topic, setTopic] = useState(TOPICS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const heading = root.current!.querySelector<HTMLElement>("[data-big]")!;
      SplitText.create(heading, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.4,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: heading, start: "top 80%", once: true },
          }),
      });
      gsap.from(root.current!.querySelectorAll("[data-in]"), {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: { trigger: "[data-contact-grid]", start: "top 80%", once: true },
      });
    },
    { scope: root },
  );

  const validate = () => {
    if (!form.name.trim()) return "Please tell me your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "That email address doesn't look right.";
    if (form.message.trim().length < 10) return "A little more detail in the message, please (10+ characters).";
    return "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      setStatus("error");
      return;
    }
    setError("");
    const message = `[${topic}]\n\n${form.message}`;
    // Inlined at build time from next.config.ts (must be accessed as plain member expressions).
    const service = process.env.EMAILJS_SERVICE_ID;
    const template = process.env.EMAILJS_TEMPLATE_ID;
    const key = process.env.EMAILJS_PUBLIC_KEY;

    // No keys configured (e.g. local dev): fall back to the visitor's mail app.
    if (!service || !template || !key) {
      const subject = encodeURIComponent(`${topic} — from ${form.name}`);
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("loading");
    try {
      const emailjs = (await import("@emailjs/browser")).default;
      await emailjs.send(service, template, { name: form.name, email: form.email, message, to_email: site.email }, { publicKey: key });
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Couldn't send right now — please email me directly instead.");
      setStatus("error");
    }
  };

  const field = (name: keyof typeof form) => ({
    name,
    id: `f-${name}`,
    value: form[name],
    placeholder: " ",
    disabled: status === "loading",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [name]: e.target.value }));
      if (status === "error" || status === "success") setStatus("idle");
    },
  });

  return (
    <section id="contact" ref={root} className="relative pt-24 pb-20 md:pt-32 md:pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[20vh] h-[90vh] bg-[radial-gradient(50%_45%_at_50%_50%,rgb(var(--accent-rgb)/0.08),transparent_100%)]" />
      <div className="container-x relative">
        <div className="mb-10 flex items-center gap-4">
          <span className="eyebrow">
            <span className="text-accent">(05)</span>
            <span className="ml-3">Contact</span>
          </span>
          <span className="h-px flex-1 bg-line" />
          <span className="flex items-center gap-2 eyebrow text-fg">
            <span className="size-2 animate-pulse-dot rounded-full bg-accent" />
            {site.availability}
          </span>
        </div>

        <h2 data-big className="text-[clamp(3.2rem,10.5vw,11rem)] leading-[0.9] font-medium tracking-[-0.06em]">
          Let’s build something <em className="serif text-accent">that ships.</em>
        </h2>

        <div data-contact-grid className="mt-16 grid gap-12 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="flex flex-col gap-10 lg:col-span-5">
            <div data-in>
              <p className="mb-4 eyebrow">Write to me</p>
              <button
                type="button"
                data-cursor="Copy"
                onClick={() => copyToClipboard(site.email, "Email copied to clipboard")}
                className="group relative flex w-full items-center justify-between gap-4 text-left text-[clamp(1.35rem,2.4vw,2.1rem)] font-medium tracking-[-0.03em]"
              >
                <span className="relative break-all">
                  {site.email}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-line-strong" />
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                </span>
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-accent group-hover:text-accent">
                  <Copy size={17} />
                </span>
              </button>
              <a href={`mailto:${site.email}`} className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg">
                or open your mail app <ArrowUpRight size={14} />
              </a>
            </div>

            <div data-in className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line">
              <div className="bg-bg p-5">
                <p className="mb-2 eyebrow">Local time</p>
                <LocalClock className="text-xl font-medium tracking-tight" />
              </div>
              <div className="bg-bg p-5">
                <p className="mb-2 eyebrow">Based in</p>
                <p className="text-xl font-medium tracking-tight">Kannur, India</p>
              </div>
            </div>

            <ul data-in className="border-t border-line">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("tel:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-4 overflow-hidden border-b border-line px-1 py-5 transition-colors duration-500 hover:text-accent-ink"
                  >
                    <span aria-hidden="true" className="absolute inset-0 origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-y-100" />
                    <span className="relative transition-transform duration-500 group-hover:translate-x-3">{l.icon}</span>
                    <span className="relative text-lg font-medium transition-transform duration-500 group-hover:translate-x-3">{l.label}</span>
                    <span className="relative ml-auto font-mono text-xs text-muted transition-colors duration-500 group-hover:text-accent-ink/70">{l.handle}</span>
                    <ArrowUpRight size={18} className="relative transition-transform duration-500 group-hover:-translate-x-3 group-hover:rotate-45" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form data-in onSubmit={submit} noValidate className="flex flex-col gap-4 rounded-[28px] border border-line bg-surface p-6 sm:p-10 lg:col-span-7">
            <fieldset className="mb-2">
              <legend className="mb-4 eyebrow">What&apos;s this about?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={topic === t}
                    onClick={() => setTopic(t)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm transition-colors duration-300",
                      topic === t ? "border-accent bg-accent text-accent-ink" : "border-line text-fg/75 hover:border-line-strong hover:text-fg",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative">
                <input {...field("name")} autoComplete="name" className="field peer" />
                <label htmlFor="f-name" className="field-label">
                  Your name
                </label>
              </div>
              <div className="relative">
                <input {...field("email")} type="email" autoComplete="email" className="field peer" />
                <label htmlFor="f-email" className="field-label">
                  Email
                </label>
              </div>
            </div>
            <div className="relative flex flex-1 flex-col">
              <textarea {...field("message")} rows={6} className="field peer min-h-40 flex-1 resize-none" />
              <label htmlFor="f-message" className="field-label">
                Tell me about the role or project
              </label>
            </div>

            <div className="mt-2 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p role="status" aria-live="polite" className={cn("text-sm", status === "error" ? "text-danger" : status === "success" ? "text-accent" : "text-muted")}>
                {status === "error" && error}
                {status === "success" && "Thanks — your message is on its way. I'll reply soon."}
                {status === "idle" && "All fields are required."}
                {status === "loading" && "Sending…"}
              </p>
              <Magnetic>
                <button type="submit" disabled={status === "loading"} className="btn btn-accent group h-14 px-8 disabled:opacity-60">
                  <RollText text={status === "loading" ? "Sending…" : "Send message"} />
                  <Send size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </Magnetic>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

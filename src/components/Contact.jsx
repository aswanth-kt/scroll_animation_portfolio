import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Github, Linkedin, Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { content } from "../data/content";
import CornerFrame from "./CornerFrame";
import SectionHeader from "./SectionHeader";

export default function Contact() {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });
  const [state, setState] = useState("idle"); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.from_name.trim()) {
      setErrorMsg("Name is required");
      return false;
    }
    if (!formData.from_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) {
      setErrorMsg("Valid email is required");
      return false;
    }
    if (!formData.message.trim()) {
      setErrorMsg("Message is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) {
      setState("error");
      return;
    }

    setState("loading");

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.from_name,
          email: formData.from_email,
          message: formData.message,
          to_email: content.email,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        setState("success");
        setFormData({ from_name: "", from_email: "", message: "" });
        setTimeout(() => setState("idle"), 3000);
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setErrorMsg("Failed to send email. Please try again.");
      setState("error");
    }
  };

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
                <a className="icon-link" href={content.links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <WhatsAppIcon size={18} />
                </a>
              </div>
            </dl>
          </CornerFrame>
          <CornerFrame>
            <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
              <label className="field-label">
                Name
                <input
                  required
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  className="field"
                  autoComplete="name"
                  disabled={state === "loading"}
                />
              </label>
              <label className="field-label">
                Email
                <input
                  required
                  name="from_email"
                  type="email"
                  value={formData.from_email}
                  onChange={handleChange}
                  className="field"
                  autoComplete="email"
                  disabled={state === "loading"}
                />
              </label>
              <label className="field-label">
                Message
                <textarea
                  required
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="field resize-none"
                  disabled={state === "loading"}
                />
              </label>

              {state === "success" && (
                <div className="flex items-center gap-2 text-sm text-paper">
                  <CheckCircle size={16} /> Message sent! I'll get back to you soon.
                </div>
              )}

              {state === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle size={16} /> {errorMsg}
                </div>
              )}

              <button className="btn-primary justify-center" type="submit" disabled={state === "loading"}>
                {state === "loading" ? "Sending..." : "Send Message"} <Send size={17} />
              </button>
            </form>
          </CornerFrame>
        </div>
      </div>
    </section>
  );
}
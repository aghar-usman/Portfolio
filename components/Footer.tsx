import React from "react";
import { Mail, FileText, ArrowUpRight, Sparkles, Code2, Globe } from "lucide-react";

interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
  resume: string;
}

interface FooterProps {
  contact: ContactInfo;
}

export default function Footer({ contact }: FooterProps) {
  return (
    <footer id="contact" className="relative py-16 border-t border-[var(--color-border)] mt-24 bg-[var(--color-bg)] overflow-hidden box-border w-full">
      {/* Decorative ambient background glow (Hardware-accelerated) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(400px,90vw)] h-[150px] bg-[var(--color-accent)]/5 blur-[80px] pointer-events-none rounded-full translate-z-0" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-8 box-border w-full min-w-0">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-[11px] sm:text-xs font-mono text-[var(--color-accent)] shadow-sm max-w-full truncate">
          <Sparkles size={12} className="animate-pulse shrink-0" />
          <span className="truncate">AVAILABLE FOR OPPORTUNITIES</span>
        </div>

        {/* Heading & Email */}
        <div className="space-y-3 w-full min-w-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-[var(--color-text)] tracking-tight break-words px-2">
            Let&apos;s build something <span className="text-[var(--color-accent)]">extraordinary</span>.
          </h2>
          <p className="text-xs sm:text-sm font-mono text-[var(--color-text-muted)] flex items-center justify-center gap-2 flex-wrap px-2">
            <Mail size={14} className="text-[var(--color-accent)] shrink-0" />
            <span className="break-all">{contact.email}</span>
          </p>
        </div>

        {/* Centered Action Links (Fully responsive layout across all device widths) */}
        <div className="flex flex-wrap justify-center gap-3 font-mono text-xs w-full min-w-0">
          <a
            href={`mailto:${contact.email}`}
            className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-colors duration-200 shadow-sm box-border"
          >
            <Mail size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform shrink-0" />
            <span>Email</span>
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </a>

          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-colors duration-200 shadow-sm box-border"
          >
            <Code2 size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform shrink-0" />
            <span>GitHub</span>
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </a>

          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-colors duration-200 shadow-sm box-border"
          >
            <Globe size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform shrink-0" />
            <span>LinkedIn</span>
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
          </a>

          {contact.resume && (
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-colors duration-200 shadow-sm box-border"
            >
              <FileText size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform shrink-0" />
              <span>Resume</span>
              <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>
          )}
        </div>

        {/* Bottom Copyright & Design Credit */}
        <div className="w-full pt-10 mt-4 border-t border-[var(--color-border)]/50 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--color-text-muted)] gap-4 box-border min-w-0">
          <p className="truncate">© {new Date().getFullYear()} • Engineered with precision.</p>
          <p className="flex items-center gap-1.5 shrink-0">
            <span>Designed with</span>
            <span className="text-[var(--color-accent)]">✦</span>
            <span>Next.js & Tailwind</span>
          </p>
        </div>

      </div>
    </footer>
  );
}

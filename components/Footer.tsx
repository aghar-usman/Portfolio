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
    <footer id="contact" className="relative py-16 border-t border-[var(--color-border)] mt-24 bg-[var(--color-bg)] overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] bg-[var(--color-accent)]/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-3xl mx-auto px-6 flex flex-col items-center text-center gap-8">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-full text-xs font-mono text-[var(--color-accent)] shadow-sm">
          <Sparkles size={12} className="animate-pulse" />
          <span>AVAILABLE FOR OPPORTUNITIES</span>
        </div>

        {/* Heading & Email */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold font-mono text-[var(--color-text)] tracking-tight">
            Let&apos;s build something <span className="text-[var(--color-accent)]">extraordinary</span> together.
          </h2>
          <p className="text-sm font-mono text-[var(--color-text-muted)] flex items-center justify-center gap-2">
            <Mail size={14} className="text-[var(--color-accent)]" />
            <span>{contact.email}</span>
          </p>
        </div>

        {/* Centered Action Links */}
        <div className="flex flex-wrap justify-center gap-3 font-mono text-xs w-full">
          <a
            href={`mailto:${contact.email}`}
            className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-all duration-300 shadow-sm"
          >
            <Mail size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
            <span>Email</span>
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-all duration-300 shadow-sm"
          >
            <Code2 size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
            <span>GitHub</span>
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-all duration-300 shadow-sm"
          >
            <Globe size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
            <span>LinkedIn</span>
            <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>

          {contact.resume && (
            <a
              href={contact.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-2)] transition-all duration-300 shadow-sm"
            >
              <FileText size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
              <span>Resume</span>
              <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          )}
        </div>

        {/* Bottom Copyright & Design Credit */}
        <div className="w-full pt-10 mt-4 border-t border-[var(--color-border)]/50 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[var(--color-text-muted)] gap-4">
          <p>© {new Date().getFullYear()} • Engineered with precision.</p>
          <p className="flex items-center gap-1.5">
            <span>Designed with</span>
            <span className="text-[var(--color-accent)]">✦</span>
            <span>Next.js & Tailwind</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
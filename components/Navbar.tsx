"use client";

import React, { useState, useEffect } from "react";
import GooeyNav from "./GooeyNav/GooeyNav";
import { Menu, X, Mail } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  links: NavLink[];
}

export default function Navbar({ links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Separate Contact from other links so it can be cleanly placed as an independent button inside the pill
  const navLinksWithoutContact = links.filter(
    (link) => !link.label.toLowerCase().includes("contact")
  );

  return (
    <>
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <div
          className="
            flex
            h-16
            w-full
            max-w-5xl
            items-center
            justify-between
            px-4
            sm:px-6
            rounded-full
            bg-[var(--color-surface)]/90
            backdrop-blur-md
            backdrop-saturate-150
            border
            border-[var(--color-border)]
            shadow-lg
            shadow-black/40
            gap-2
            overflow-visible
          "
        >
          {/* BRAND */}
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="
              font-mono
              text-lg
              sm:text-xl
              font-extrabold
              tracking-wider
              text-[var(--color-text)]
              transition-colors
              duration-300
              hover:text-[var(--color-accent)]
              shrink-0
            "
          >
            AUKT.
          </a>

          {/* DESKTOP NAV CONTAINER */}
          <div className="hidden md:flex items-center justify-end gap-2 flex-1 min-w-0 px-2 overflow-visible">
            <div className="overflow-visible scale-90 lg:scale-100 origin-right">
              <GooeyNav
                items={navLinksWithoutContact}
                particleCount={14}
                particleDistances={[60, 10]}
                initialActiveIndex={0}
                animationTime={850}
                timeVariance={250}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              />
            </div>

            <a
              href="#contact"
              className="group flex items-center gap-1.5 px-3.5 py-2 bg-[var(--color-surface-2)] text-[var(--color-text)] font-mono text-xs font-semibold rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 shadow-sm shrink-0"
            >
              <Mail size={12} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
              <span>Contact</span>
            </a>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors focus:outline-none shrink-0"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MOBILE FULLSCREEN OVERLAY MENU */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-xl flex flex-col justify-center items-center transition-all duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-6 text-center">
          {links.map((link, idx) => {
            const isContact = link.label.toLowerCase().includes("contact");
            return (
              <a
                key={idx}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-colors py-2 flex items-center gap-2 ${
                  isContact
                    ? "mt-4 px-6 py-3 bg-[var(--color-surface)] text-[var(--color-accent)] font-mono text-base font-bold rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)]"
                    : "text-2xl font-mono font-bold text-[var(--color-text)] hover:text-[var(--color-accent)]"
                }`}
              >
                {isContact && <Mail size={18} />}
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}

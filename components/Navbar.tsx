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

  // Separate Contact entirely so the navbar items fit perfectly without crowding
  const navLinksWithoutContact = links.filter(
    (link) => !link.label.toLowerCase().includes("contact")
  );

  return (
    <>
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 w-full">
        <div
          className="
            flex
            h-16
            w-full
            max-w-6xl
            items-center
            justify-between
            px-6
            rounded-full
            bg-[var(--color-surface)]/90
            backdrop-blur-md
            backdrop-saturate-150
            border
            border-[var(--color-border)]
            shadow-lg
            shadow-black/40
            gap-6
          "
        >
          {/* BRAND */}
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="
              font-mono
              text-xl
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

          {/* DESKTOP NAV CONTAINER (GooeyNav items completely fitted and fluid) */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-xl mx-auto overflow-hidden">
            <GooeyNav
              items={navLinksWithoutContact}
              particleCount={6}
              particleDistances={[20, 3]}
              initialActiveIndex={0}
              animationTime={400}
              timeVariance={150}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          {/* SEPARATE DESKTOP CONTACT BUTTON (Ensures it never overlaps or crowds navigation items) */}
          <div className="hidden lg:flex items-center shrink-0">
            <a
              href="#contact"
              className="group flex items-center gap-2 px-5 py-2.5 bg-[var(--color-surface-2)] text-[var(--color-text)] font-mono text-xs font-semibold rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-300 shadow-sm"
            >
              <Mail size={14} className="text-[var(--color-accent)] group-hover:scale-110 transition-transform" />
              <span>Contact</span>
            </a>
          </div>

          {/* HAMBURGER BUTTON (Active on smaller screens where nav items would overflow) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors focus:outline-none shrink-0 ml-auto"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* FULLSCREEN OVERLAY MOBILE MENU */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--color-bg)]/95 backdrop-blur-xl flex flex-col justify-center items-center px-6 transition-all duration-300 overflow-y-auto lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-5 text-center w-full max-w-xs py-12 my-auto">
          {links.map((link, idx) => {
            const isContact = link.label.toLowerCase().includes("contact");
            return (
              <a
                key={idx}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`transition-colors py-2.5 flex items-center justify-center gap-2.5 w-full ${
                  isContact
                    ? "mt-4 px-6 py-3.5 bg-[var(--color-surface)] text-[var(--color-accent)] font-mono text-base font-bold rounded-xl border border-[var(--color-border)] hover:border-[var(--color-accent)] shadow-md"
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

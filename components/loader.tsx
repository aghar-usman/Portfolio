"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const dismiss = () => setVisible(false);
    const accessibility = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (accessibility.matches || window.scrollY > 8 || (location.hash && location.hash !== "#about")) {
      dismiss();
      return;
    }

    const timer = window.setTimeout(dismiss, 1350);
    accessibility.addEventListener("change", dismiss);
    window.addEventListener("pointerdown", dismiss, { once: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("scroll", dismiss, { once: true, passive: true });

    return () => {
      window.clearTimeout(timer);
      accessibility.removeEventListener("change", dismiss);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("scroll", dismiss);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pf-loader" aria-hidden="true" onAnimationEnd={(event) => {
      if (event.target === event.currentTarget) setVisible(false);
    }}>
      <div className="pf-loader-mark">
        <svg viewBox="0 0 122 88" fill="none">
          <path className="pf-loader-base" d="M10 64 44 44l67 18-35 20Z" />
          <path className="pf-loader-middle" d="m10 45 34-20 67 18-35 20Z" />
          <path className="pf-loader-front" d="m10 26 34-20 67 18-35 20Z" />
        </svg>
        <div className="pf-loader-name">AUKT<span>.</span></div>
      </div>
      <style>{loaderStyles}</style>
    </div>
  );
}

const loaderStyles = `
.pf-loader {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 90;
  background: var(--color-bg);
  color: var(--color-text);
  pointer-events: none;
  animation: pf-open 1.12s cubic-bezier(.65, 0, .25, 1) both;
}
.pf-loader-mark { display: grid; justify-items: center; gap: 13px; }
.pf-loader-mark svg { width: clamp(82px, 13vw, 126px); overflow: visible; stroke: var(--color-accent); stroke-width: 1.2; stroke-linejoin: round; }
.pf-loader-mark path { fill: var(--color-bg); }
.pf-loader-base { animation: pf-set-base 640ms cubic-bezier(.2, .78, .2, 1) both; }
.pf-loader-middle { animation: pf-set-middle 570ms cubic-bezier(.2, .78, .2, 1) both; }
.pf-loader-front { animation: pf-set-front 650ms cubic-bezier(.2, .78, .2, 1) both; }
.pf-loader-name { font: 600 clamp(26px, 5vw, 47px)/1 var(--font-sans); letter-spacing: -.06em; }
.pf-loader-name span { color: var(--color-accent); }
@keyframes pf-set-base { from { transform: translateY(-18px); opacity: .3; } to { transform: none; opacity: .42; } }
@keyframes pf-set-middle { from { opacity: .3; } to { opacity: .72; } }
@keyframes pf-set-front { from { transform: translateY(18px); opacity: .6; } to { transform: none; opacity: 1; } }
@keyframes pf-open {
  0%, 63% { clip-path: inset(0); visibility: visible; }
  99% { visibility: visible; }
  100% { clip-path: inset(0 0 100%); visibility: hidden; }
}
@media (prefers-reduced-motion: reduce) { .pf-loader { display: none; } }
`;

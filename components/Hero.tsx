"use client";

import { useEffect, useRef, useState } from "react";

interface HeroProps {
  profile: {
    name: string;
    roles: string[];
    summary?: string | string[];
    location?: string;
    headline?: string;
    intro?: string;
  };
  contact: { resume: string; github: string; linkedin: string };
  media: {
    /** Your walk-in -> phone in pocket -> wave -> zoom MP4 */
    introVideoSrc?: string;
    /** Exact second when the zoom-in starts after the wave (triggers handoff) */
    zoomAt?: number;
    /** Transparent PNG cutout of your character for the hero stage */
    characterSrc: string;
    /** Optional: drop a seamless looping idle MP4/WebM here later if desired */
    idleVideoSrc?: string;
  };
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Hero({ profile, contact, media }: HeroProps) {
  const role = profile.roles.join(" / ") || "Full-stack developer";
  const heading = profile.headline?.trim() || "AUKT.\n— 26";
  const intro =
    profile.intro ?? [profile.summary].flat().filter(Boolean).join(" ");

  const [phase, setPhase] = useState<"playing" | "zooming" | "done">(
    media.introVideoSrc ? "playing" : "done"
  );
  const [progress, setProgress] = useState(0);
  const [ctaHovered, setCtaHovered] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const triggeredRef = useRef(false);

  const triggerZoomTransition = () => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    setProgress(100);
    setPhase("zooming");

    try {
      sessionStorage.setItem("aukt-intro-seen", "1");
    } catch {}

    window.setTimeout(() => setPhase("done"), 680);
  };

  useEffect(() => {
    if (!media.introVideoSrc) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("aukt-intro-seen") === "1";

    if (reduced || seen) {
      setPhase("done");
      return;
    }

    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [media.introVideoSrc]);

  useEffect(() => {
    if (phase === "done") {
      document.documentElement.style.overflow = "";
    }
  }, [phase]);

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;

    const target = media.zoomAt || vid.duration || 4;
    const pct = Math.min(99, Math.round((vid.currentTime / target) * 100));
    setProgress(pct);

    if (media.zoomAt && vid.currentTime >= media.zoomAt) {
      triggerZoomTransition();
    }
  };

  const heroVisible = phase === "zooming" || phase === "done";

  return (
    <>
      {/* 1. PHONE-IN-POCKET -> WAVE -> ZOOM LOADER */}
      {phase !== "done" && media.introVideoSrc && (
        <div
          className={`ph-loader ${phase === "zooming" ? "is-zooming" : ""}`}
          role="dialog"
          aria-label="AUKT intro animation"
        >
          <div className="ph-loader-stage">
            <video
              ref={videoRef}
              className="ph-loader-video"
              src={media.introVideoSrc}
              poster={media.characterSrc}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={triggerZoomTransition}
              onError={triggerZoomTransition}
            />
          </div>

          <div className="ph-loader-bar">
            <span className="font-mono text-xs tracking-wider text-[var(--color-text-muted)]">
              AUKT.
            </span>
            <span className="font-mono text-sm font-medium tabular-nums text-[var(--color-text)]">
              {String(progress).padStart(2, "0")}%
            </span>
            <button
              type="button"
              className="btn-secondary rounded-md px-4 font-mono text-xs"
              onClick={triggerZoomTransition}
            >
              Skip intro
            </button>
          </div>
        </div>
      )}

      {/* 2. FRAMER-VIBE EDITORIAL HERO */}
      <section
        id="about"
        className={`ph-hero ${heroVisible ? "is-ready" : ""}`}
        data-enter={heroVisible ? "in" : "wait"}
        aria-labelledby="ph-title"
      >
        <div className="ph-wrap mx-[var(--portfolio-gutter)]">
          {/* Left: Bold Editorial Typography */}
          <div className="ph-copy">
            <div className="ph-meta">
              <p className="ph-name">{profile.name}</p>
              <p className="ph-role">
                {[role, profile.location].filter(Boolean).join(" · ")}
              </p>
            </div>

            <h1 id="ph-title">{heading}</h1>
            <p className="ph-intro">{intro}</p>

            <div className="ph-actions">
              <a
                className="btn-primary ph-btn"
                href="#projects"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                View projects <Arrow />
              </a>
              {contact.resume && (
                <a
                  className="btn-secondary ph-btn"
                  href={contact.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View résumé <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Right: Grounded Character Stage */}
          <div
            className={`ph-stage ${ctaHovered ? "is-attentive" : ""}`}
            aria-hidden="true"
          >
            <div className="ph-coral-slab" />
            <div className="ph-floor-shadow" />

            <div className="ph-actor">
              {media.idleVideoSrc ? (
                <video
                  src={media.idleVideoSrc}
                  poster={media.characterSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="ph-actor-media"
                />
              ) : (
                <img
                  src={media.characterSrc}
                  alt=""
                  className="ph-actor-media"
                  loading="eager"
                  decoding="async"
                />
              )}
            </div>
          </div>
        </div>

        <style>{heroStyles}</style>
      </section>
    </>
  );
}

const heroStyles = `
  /* ---------- Loader & Continuous Zoom Handoff ---------- */
  .ph-loader {
    position: fixed;
    inset: 0;
    z-index: 250;
    display: grid;
    grid-template-rows: 1fr auto;
    place-items: center;
    background: var(--color-bg);
    opacity: 1;
    transition: opacity 580ms cubic-bezier(0.22, 1, 0.36, 1) 80ms;
  }
  .ph-loader.is-zooming {
    opacity: 0;
    pointer-events: none;
  }
  .ph-loader-stage {
    position: relative;
    display: grid;
    place-items: center;
    width: min(94vw, 820px);
    height: min(76svh, 580px);
    transform: scale(1);
    transition: transform 680ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ph-loader.is-zooming .ph-loader-stage {
    transform: scale(1.32);
  }
  .ph-loader-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .ph-loader-bar {
    width: 100%;
    padding: 16px var(--portfolio-gutter) max(20px, env(safe-area-inset-bottom));
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--color-border);
    transition: opacity 260ms ease;
  }
  .ph-loader.is-zooming .ph-loader-bar {
    opacity: 0;
  }

  /* ---------- Editorial Hero ---------- */
  .ph-hero {
    position: relative;
    overflow: clip;
    background: var(--color-bg);
    transform: scale(0.95);
    opacity: 0;
    transition:
      transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 600ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ph-hero.is-ready {
    transform: scale(1);
    opacity: 1;
  }

  .ph-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    align-items: center;
    gap: clamp(28px, 4vw, 64px);
    min-height: calc(100svh - var(--site-header-height));
    padding-top: 32px;
  }

  .ph-copy {
    position: relative;
    z-index: 2;
    padding-bottom: 48px;
  }
  .ph-meta {
    display: grid;
    gap: 4px;
    margin-bottom: clamp(20px, 3vw, 38px);
  }
  .ph-name {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--color-text);
  }
  .ph-role {
    margin: 0;
    font: 12px/1.5 var(--font-mono);
    color: var(--color-text-muted);
  }

  .ph-copy h1 {
    margin: 0 0 22px;
    font-size: clamp(58px, 8.6vw, 132px);
    line-height: 0.92;
    letter-spacing: -0.065em;
    font-weight: 500;
    white-space: pre-line;
    color: var(--color-accent-text);
  }
  .ph-copy h1::first-line {
    color: var(--color-text);
  }

  .ph-intro {
    margin: 0;
    max-width: 42ch;
    font-size: 17px;
    line-height: 1.65;
    color: var(--color-text-body);
    text-wrap: pretty;
  }

  .ph-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }
  .ph-btn {
    padding: 0 20px;
    min-height: 50px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
  }
  @media (hover: hover) and (pointer: fine) {
    .ph-actions svg { transition: transform 160ms var(--acc-ease); }
    .ph-actions a:hover svg { transform: translateX(3px); }
  }

  /* ---------- Grounded Character Stage ---------- */
  .ph-stage {
    position: relative;
    align-self: end;
    display: grid;
    place-items: end center;
    height: min(80svh, 680px);
    pointer-events: none;
  }
  .ph-coral-slab {
    position: absolute;
    inset: 10% 8% 0 8%;
    border-radius: 22px 22px 0 0;
    background: var(--color-brand-band);
    transform: translateY(28px);
    opacity: 0;
    transition:
      transform 640ms cubic-bezier(0.16, 1, 0.3, 1) 120ms,
      opacity 540ms ease 120ms;
  }
  .ph-hero.is-ready .ph-coral-slab {
    transform: translateY(0);
    opacity: 1;
  }

  .ph-floor-shadow {
    position: absolute;
    bottom: 6px;
    width: 62%;
    height: 22px;
    border-radius: 50%;
    background: radial-gradient(
      ellipse,
      color-mix(in srgb, var(--color-brand-ink) 32%, transparent) 0%,
      transparent 72%
    );
  }

  .ph-actor {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: flex-end;
    transform-origin: center bottom;
    transition: transform 320ms var(--acc-ease);
  }
  .ph-hero.is-ready .ph-actor {
    animation: ph-auto-idle 4.2s ease-in-out infinite;
  }
  .ph-stage.is-attentive .ph-actor {
    transform: translateX(-8px) scale(1.02);
  }

  .ph-actor-media {
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: bottom center;
  }

  @keyframes ph-auto-idle {
    0%, 100% { transform: translateY(0) scaleY(1); }
    50% { transform: translateY(-4px) scaleY(1.008); }
  }

  @media (max-width: 900px) {
    .ph-wrap {
      grid-template-columns: 1fr;
      gap: 24px;
      padding-top: 28px;
    }
    .ph-copy { padding-bottom: 0; }
    .ph-stage { height: min(54svh, 440px); }
    .ph-coral-slab { inset: 12% 10% 0 10%; }
  }

  @media (max-width: 390px) {
    .ph-actions { display: grid; grid-template-columns: 1fr; }
    .ph-btn { width: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ph-hero, .ph-coral-slab { opacity: 1; transform: none; }
    .ph-hero.is-ready .ph-actor { animation: none; }
  }
`;

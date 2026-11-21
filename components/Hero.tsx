"use client";

import { useEffect, useRef, useState } from "react";

interface HeroProps {
  profile: {
    name: string;
    roles: string[];
    summary: string | string[];
    location?: string;
    headline?: string;
    intro?: string;
  };
  contact: { resume: string; github: string; linkedin: string };
  media?: {
    /** MP4 or WebM clip: walks in -> stops -> snaps */
    introVideoSrc?: string;
    /** Exact second in the video when the finger snap happens (triggers wipe) */
    snapAt?: number;
    /** Main transparent character cutout PNG */
    characterSrc?: string;
    /** Optional separate waving arm PNG for layered animation */
    armSrc?: string;
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
  const heading = profile.headline?.trim() || role;
  const intro = profile.intro ?? [profile.summary].flat().join(" ");

  const videoSrc = media?.introVideoSrc; // e.g. "/media/intro-snap.mp4"
  const snapAt = media?.snapAt; // e.g. 2.4
  const characterSrc = media?.characterSrc || "/images/character-hero.png";

  // Loader states: "playing" -> "snapping" -> "done"
  const [phase, setPhase] = useState<"playing" | "snapping" | "done">(
    videoSrc ? "playing" : "done"
  );
  const [ctaHovered, setCtaHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const snappedRef = useRef(false);

  const triggerSnap = () => {
    if (snappedRef.current) return;
    snappedRef.current = true;
    setPhase("snapping");
    try {
      sessionStorage.setItem("hero-intro-seen", "1");
    } catch {}
    window.setTimeout(() => setPhase("done"), 620);
  };

  useEffect(() => {
    if (!videoSrc) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("hero-intro-seen") === "1";

    if (reduced || seen) {
      setPhase("done");
      return;
    }

    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [videoSrc]);

  useEffect(() => {
    if (phase === "done") {
      document.documentElement.style.overflow = "";
    }
  }, [phase]);

  const handleTimeUpdate = () => {
    if (!snapAt || !videoRef.current) return;
    if (videoRef.current.currentTime >= snapAt) {
      triggerSnap();
    }
  };

  return (
    <>
      {/* 1. WALK-IN + SNAP INTRO LOADER */}
      {phase !== "done" && videoSrc && (
        <div
          className={`ph-loader ${phase === "snapping" ? "is-snapping" : ""}`}
          role="dialog"
          aria-label="Intro animation"
        >
          <div className="ph-loader-stage">
            <video
              ref={videoRef}
              className="ph-loader-video"
              src={videoSrc}
              poster={characterSrc}
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={triggerSnap}
              onError={triggerSnap}
            />
            <span className="ph-snap-ring" aria-hidden="true" />
          </div>

          <button type="button" className="ph-skip" onClick={triggerSnap}>
            Skip intro
          </button>
        </div>
      )}

      {/* 2. EDITORIAL CUTOUT HERO */}
      <section
        id="about"
        className={`ph-hero ${phase === "done" ? "is-ready" : ""}`}
        data-portfolio-chapter=""
        data-enter={phase === "done" ? "in" : "wait"}
        aria-labelledby="ph-title"
      >
        <div className="ph-wrap">
          <div className="ph-copy">
            <div className="ph-identity">
              <p className="ph-name">{profile.name}</p>
              <p className="ph-role">
                {[role, profile.location].filter(Boolean).join(" · ")}
              </p>
            </div>

            <h1 id="ph-title">{heading}</h1>
            <p className="ph-intro">{intro}</p>

            <div className="ph-actions">
              <a
                className="btn-primary ph-primary"
                href="#projects"
                onMouseEnter={() => setCtaHovered(true)}
                onMouseLeave={() => setCtaHovered(false)}
              >
                View projects <Arrow />
              </a>

              {contact.resume && (
                <a
                  className="btn-secondary ph-secondary"
                  href={contact.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View résumé <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Grounded Character Stage */}
          <div
            className={`ph-stage ${ctaHovered ? "is-attentive" : ""}`}
            aria-hidden="true"
          >
            <div className="ph-coral-slab" />
            <div className="ph-floor-shadow" />

            <div className="ph-actor">
              {/* Client asset slot: transparent PNG cutout of character */}
              <img
                src={characterSrc}
                alt=""
                className="ph-actor-body"
                loading="eager"
                decoding="async"
              />
              {/* Optional separate waving arm layer when split */}
              {media?.armSrc && (
                <img
                  src={media.armSrc}
                  alt=""
                  className="ph-actor-arm"
                  loading="eager"
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
  /* ---------- Intro Loader & Snap Transition ---------- */
  .ph-loader {
    position: fixed;
    inset: 0;
    z-index: 250;
    display: grid;
    place-items: center;
    background: var(--color-bg);
    clip-path: inset(0 0 0 0);
    transition: clip-path 560ms cubic-bezier(0.77, 0, 0.175, 1);
  }
  .ph-loader.is-snapping {
    clip-path: inset(0 0 100% 0);
    pointer-events: none;
  }
  .ph-loader-stage {
    position: relative;
    display: grid;
    place-items: center;
    width: min(92vw, 560px);
    height: min(82svh, 680px);
  }
  .ph-loader-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .ph-snap-ring {
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 999px;
    border: 2px solid var(--color-accent);
    opacity: 0;
    pointer-events: none;
  }
  .ph-loader.is-snapping .ph-snap-ring {
    animation: ph-snap-burst 480ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  .ph-skip {
    position: fixed;
    right: max(20px, env(safe-area-inset-right));
    bottom: max(20px, env(safe-area-inset-bottom));
    min-height: 44px;
    padding: 0 16px;
    border: 1px solid var(--color-border-strong);
    border-radius: 6px;
    background: var(--color-surface);
    color: var(--color-text);
    font: 12px/1 var(--font-mono);
    cursor: pointer;
    transition: background-color 160ms var(--acc-ease), transform 160ms var(--acc-ease);
  }
  .ph-skip:hover { background: var(--color-surface-2); transform: translateY(-1px); }
  .ph-skip:active { transform: translateY(1px); }

  @keyframes ph-snap-burst {
    0% { opacity: 0.95; transform: scale(1); }
    100% { opacity: 0; transform: scale(16); }
  }

  /* ---------- Editorial Split Hero ---------- */
  .ph-hero {
    position: relative;
    overflow: clip;
    background: var(--color-bg);
    color: var(--color-text);
  }
  .ph-wrap {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    align-items: center;
    gap: clamp(28px, 4vw, 64px);
    min-height: calc(100svh - var(--site-header-height));
    padding-block: 36px 0;
  }

  .ph-copy {
    position: relative;
    z-index: 2;
    min-width: 0;
    padding-bottom: 48px;
    opacity: 0;
    transform: translateY(14px);
    transition: opacity 520ms var(--acc-ease), transform 520ms var(--acc-ease);
  }
  .ph-hero.is-ready .ph-copy {
    opacity: 1;
    transform: translateY(0);
  }

  .ph-identity { display: grid; gap: 5px; margin-block-end: clamp(20px, 3vw, 40px); }
  .ph-name { margin: 0; font-size: 15px; font-weight: 600; line-height: 1.35; color: var(--color-text); }
  .ph-role { margin: 0; color: var(--color-text-muted); font: 12px/1.55 var(--font-mono); }

  .ph-copy h1 {
    margin: 0 0 24px;
    font-size: clamp(44px, 6.2vw, 92px);
    line-height: 0.98;
    letter-spacing: -0.06em;
    font-weight: 500;
    overflow-wrap: anywhere;
    white-space: pre-line;
    color: var(--color-text-muted);
  }
  .ph-copy h1::first-line { color: var(--color-text); }

  .ph-intro {
    color: var(--color-text-body);
    max-width: 44ch;
    font-size: 17px;
    line-height: 1.65;
    margin: 0;
    text-wrap: pretty;
  }

  .ph-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .ph-actions a {
    gap: 20px;
    min-height: 50px;
    padding: 12px 20px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
  }
  @media (hover: hover) and (pointer: fine) {
    .ph-actions svg { transition: transform 160ms var(--acc-ease); }
    .ph-primary:hover svg { transform: translateX(3px); }
  }

  /* ---------- Grounded Character Stage ---------- */
  .ph-stage {
    position: relative;
    align-self: end;
    display: grid;
    place-items: end center;
    height: min(78svh, 660px);
    pointer-events: none;
  }
  .ph-coral-slab {
    position: absolute;
    inset: 12% 8% 0 8%;
    border-radius: 20px 20px 0 0;
    background: var(--color-brand-band);
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 560ms var(--acc-ease) 100ms, transform 560ms var(--acc-ease) 100ms;
  }
  .ph-hero.is-ready .ph-coral-slab {
    opacity: 1;
    transform: translateY(0);
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
    animation: ph-breathe 4.2s ease-in-out infinite;
  }
  .ph-stage.is-attentive .ph-actor {
    transform: translateX(-8px) scale(1.015);
  }

  .ph-actor-body {
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: bottom center;
  }
  .ph-actor-arm {
    position: absolute;
    inset: 0;
    height: 100%;
    width: auto;
    transform-origin: 36% 42%;
    animation: ph-wave 1.1s var(--acc-ease) 0.45s 1;
  }

  @keyframes ph-breathe {
    0%, 100% { transform: translateY(0) scaleY(1); }
    50% { transform: translateY(-3px) scaleY(1.006); }
  }
  @keyframes ph-wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-10deg); }
    55% { transform: rotate(8deg); }
    80% { transform: rotate(-5deg); }
  }

  /* ---------- Responsive ---------- */
  @media (max-width: 900px) {
    .ph-wrap {
      grid-template-columns: 1fr;
      padding-block: 36px 0;
      gap: 28px;
    }
    .ph-copy { padding-bottom: 0; }
    .ph-stage { height: min(52svh, 420px); }
    .ph-coral-slab { inset: 14% 12% 0 12%; }
  }
  @media (max-width: 639px) {
    .ph-copy h1 { font-size: clamp(38px, 10.5vw, 64px); margin-bottom: 16px; }
    .ph-intro { font-size: 15px; }
    .ph-actions { margin-top: 20px; gap: 8px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ph-copy, .ph-coral-slab { opacity: 1; transform: none; }
    .ph-hero.is-ready .ph-actor, .ph-actor-arm { animation: none; }
  }
`;

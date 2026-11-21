"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

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
    /** Walk-in -> phone in pocket -> wave -> zoom MP4 */
    introVideoSrc?: string;
    /** Exact second when zoom-in starts after the wave */
    zoomAt?: number;
    /** Base standing cutout PNG (transparent background) */
    characterSrc: string;
    /** Optional: pixel-locked eyes-closed PNG for auto blink */
    blinkSrc?: string;
    /** Optional: pixel-locked glancing-left PNG for CTA hover */
    lookSrc?: string;
    /** Optional: isolated waving forearm PNG for smooth wave rotation */
    armSrc?: string;
  };
}

const CLICK_LINES = ["Hey there!", "Scroll for work ↓", "Let's build.", "AUKT. 26"];

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
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const triggeredRef = useRef(false);
  const clickIndexRef = useRef(0);
  const bubbleTimerRef = useRef<number | null>(null);

  const quickXRef = useRef<gsap.QuickToFunc | null>(null);
  const quickYRef = useRef<gsap.QuickToFunc | null>(null);
  const quickRotRef = useRef<gsap.QuickToFunc | null>(null);

  const heroVisible = phase === "zooming" || phase === "done";

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

  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
    };
  }, []);

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

  /* ---------- GSAP Micro-Rig (Scoped & Auto-Cleaned) ---------- */
  const { contextSafe } = useGSAP(
    () => {
      if (!heroVisible) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Calm idle breathing loop
        gsap.to(".ph-actor-breathe", {
          y: -3.5,
          scaleY: 1.008,
          duration: 2.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // 2. One-time welcome wave on hero reveal
        if (media.armSrc) {
          gsap.fromTo(
            ".ph-layer-arm",
            { rotation: 0 },
            {
              keyframes: [
                { rotation: -11, duration: 0.18, ease: "power2.out" },
                { rotation: 8, duration: 0.2, ease: "sine.inOut" },
                { rotation: -6, duration: 0.18, ease: "sine.inOut" },
                { rotation: 0, duration: 0.24, ease: "power2.inOut" },
              ],
              delay: 0.35,
            }
          );
        }

        // 3. Randomized natural blink loop
        let blinkCall: gsap.core.Tween | null = null;
        if (media.blinkSrc) {
          const scheduleBlink = () => {
            blinkCall = gsap.delayedCall(gsap.utils.random(3.2, 5.4), () => {
              gsap
                .timeline({ onComplete: scheduleBlink })
                .set(".ph-layer-blink", { opacity: 1 })
                .to({}, { duration: 0.11 })
                .set(".ph-layer-blink", { opacity: 0 });
            });
          };
          scheduleBlink();
        }

        // 4. High-frequency pointer follow with gsap.quickTo
        quickXRef.current = gsap.quickTo(".ph-actor-pointer", "x", {
          duration: 0.45,
          ease: "power3.out",
        });
        quickYRef.current = gsap.quickTo(".ph-actor-pointer", "y", {
          duration: 0.45,
          ease: "power3.out",
        });
        quickRotRef.current = gsap.quickTo(".ph-actor-pointer", "rotation", {
          duration: 0.5,
          ease: "power3.out",
        });

        return () => {
          blinkCall?.kill();
          quickXRef.current = null;
          quickYRef.current = null;
          quickRotRef.current = null;
        };
      });
    },
    { scope: heroRef, dependencies: [heroVisible, media.armSrc, media.blinkSrc] }
  );

  /* ---------- Context-Safe Hover & Click Handlers ---------- */
  const playWave = contextSafe((energetic = false) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!media.armSrc) return;

    gsap.killTweensOf(".ph-layer-arm");
    gsap.to(".ph-layer-arm", {
      keyframes: energetic
        ? [
            { rotation: -14, duration: 0.14, ease: "power2.out" },
            { rotation: 11, duration: 0.14, ease: "sine.inOut" },
            { rotation: -10, duration: 0.14, ease: "sine.inOut" },
            { rotation: 7, duration: 0.14, ease: "sine.inOut" },
            { rotation: 0, duration: 0.22, ease: "power2.inOut" },
          ]
        : [
            { rotation: -9, duration: 0.16, ease: "power2.out" },
            { rotation: 6, duration: 0.18, ease: "sine.inOut" },
            { rotation: 0, duration: 0.2, ease: "power2.inOut" },
          ],
    });
  });

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current || !quickXRef.current || !quickYRef.current || !quickRotRef.current) {
      return;
    }
    const rect = stageRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    quickXRef.current(nx * 14);
    quickYRef.current(ny * 6);
    quickRotRef.current(nx * 2.4);
  };

  const handleStagePointerLeave = () => {
    quickXRef.current?.(0);
    quickYRef.current?.(0);
    quickRotRef.current?.(0);
  };

  const handleCharacterClick = contextSafe(() => {
    const line = CLICK_LINES[clickIndexRef.current % CLICK_LINES.length];
    clickIndexRef.current += 1;
    setBubbleText(line);

    if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = window.setTimeout(() => setBubbleText(null), 2100);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Tactile squash-and-stretch hop + synced floor shadow
    gsap.killTweensOf([".ph-actor-hop", ".ph-floor-shadow"]);
    gsap
      .timeline()
      .to(".ph-actor-hop", {
        scaleX: 1.05,
        scaleY: 0.94,
        duration: 0.1,
        ease: "power2.out",
      })
      .to(
        ".ph-actor-hop",
        {
          y: -22,
          scaleX: 0.97,
          scaleY: 1.04,
          duration: 0.2,
          ease: "power2.out",
        },
        ">"
      )
      .to(
        ".ph-floor-shadow",
        { scaleX: 0.82, opacity: 0.55, duration: 0.2, ease: "power2.out" },
        "<"
      )
      .to(".ph-actor-hop", {
        y: 0,
        scaleX: 1.03,
        scaleY: 0.97,
        duration: 0.18,
        ease: "power2.in",
      })
      .to(
        ".ph-floor-shadow",
        { scaleX: 1, opacity: 1, duration: 0.18, ease: "power2.in" },
        "<"
      )
      .to(".ph-actor-hop", {
        scaleX: 1,
        scaleY: 1,
        duration: 0.22,
        ease: "elastic.out(1, 0.55)",
      });

    playWave(true);
  });

  const handleCtaHover = contextSafe((entering: boolean) => {
    if (media.lookSrc) {
      gsap.to(".ph-layer-look", {
        opacity: entering ? 1 : 0,
        duration: 0.16,
        ease: "power2.out",
      });
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.to(".ph-actor-pointer", {
      x: entering ? -10 : 0,
      rotation: entering ? -1.4 : 0,
      duration: 0.32,
      ease: "power3.out",
    });
  });

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

      {/* 2. FRAMER-VIBE EDITORIAL HERO + INTERACTIVE MICRO-RIG */}
      <section
        ref={heroRef}
        id="about"
        className={`ph-hero ${heroVisible ? "is-ready" : ""}`}
        data-enter={heroVisible ? "in" : "wait"}
        aria-labelledby="ph-title"
      >
        <div className="ph-wrap mx-[var(--portfolio-gutter)]">
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
                onMouseEnter={() => handleCtaHover(true)}
                onMouseLeave={() => handleCtaHover(false)}
                onFocus={() => handleCtaHover(true)}
                onBlur={() => handleCtaHover(false)}
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

          {/* Interactive Character Stage */}
          <div
            ref={stageRef}
            className="ph-stage"
            onPointerMove={handleStagePointerMove}
            onPointerLeave={handleStagePointerLeave}
          >
            <div className="ph-coral-slab" aria-hidden="true" />
            <div className="ph-floor-shadow" aria-hidden="true" />

            <button
              type="button"
              className="ph-actor-trigger"
              onClick={handleCharacterClick}
              onMouseEnter={() => playWave(false)}
              aria-label={`Interact with ${profile.name}'s character`}
            >
              {bubbleText && (
                <span className="ph-bubble" role="status" aria-live="polite">
                  {bubbleText}
                </span>
              )}

              <span className="ph-actor-hop">
                <span className="ph-actor-pointer">
                  <span className="ph-actor-breathe">
                    <img
                      src={media.characterSrc}
                      alt=""
                      className="ph-layer ph-layer-base"
                      loading="eager"
                      decoding="async"
                    />
                    {media.lookSrc && (
                      <img
                        src={media.lookSrc}
                        alt=""
                        className="ph-layer ph-layer-look"
                        loading="eager"
                      />
                    )}
                    {media.blinkSrc && (
                      <img
                        src={media.blinkSrc}
                        alt=""
                        className="ph-layer ph-layer-blink"
                        loading="eager"
                      />
                    )}
                    {media.armSrc && (
                      <img
                        src={media.armSrc}
                        alt=""
                        className="ph-layer ph-layer-arm"
                        loading="eager"
                      />
                    )}
                  </span>
                </span>
              </span>
            </button>
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
  .ph-loader.is-zooming { opacity: 0; pointer-events: none; }
  .ph-loader-stage {
    position: relative;
    display: grid;
    place-items: center;
    width: min(94vw, 820px);
    height: min(76svh, 580px);
    transform: scale(1);
    transition: transform 680ms cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ph-loader.is-zooming .ph-loader-stage { transform: scale(1.32); }
  .ph-loader-video { width: 100%; height: 100%; object-fit: contain; }
  .ph-loader-bar {
    width: 100%;
    padding: 16px var(--portfolio-gutter) max(20px, env(safe-area-inset-bottom));
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--color-border);
    transition: opacity 260ms ease;
  }
  .ph-loader.is-zooming .ph-loader-bar { opacity: 0; }

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
  .ph-hero.is-ready { transform: scale(1); opacity: 1; }

  .ph-wrap {
    display: grid;
    grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
    align-items: center;
    gap: clamp(28px, 4vw, 64px);
    min-height: calc(100svh - var(--site-header-height));
    padding-top: 32px;
  }

  .ph-copy { position: relative; z-index: 2; padding-bottom: 48px; }
  .ph-meta { display: grid; gap: 4px; margin-bottom: clamp(20px, 3vw, 38px); }
  .ph-name { margin: 0; font-size: 15px; font-weight: 600; color: var(--color-text); }
  .ph-role { margin: 0; font: 12px/1.5 var(--font-mono); color: var(--color-text-muted); }

  .ph-copy h1 {
    margin: 0 0 22px;
    font-size: clamp(58px, 8.6vw, 132px);
    line-height: 0.92;
    letter-spacing: -0.065em;
    font-weight: 500;
    white-space: pre-line;
    color: var(--color-accent-text);
  }
  .ph-copy h1::first-line { color: var(--color-text); }
  .ph-intro {
    margin: 0;
    max-width: 42ch;
    font-size: 17px;
    line-height: 1.65;
    color: var(--color-text-body);
    text-wrap: pretty;
  }

  .ph-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
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

  /* ---------- Interactive Grounded Character Stage ---------- */
  .ph-stage {
    position: relative;
    align-self: end;
    display: grid;
    place-items: end center;
    height: min(80svh, 680px);
  }
  .ph-coral-slab {
    position: absolute;
    inset: 10% 8% 0 8%;
    border-radius: 22px 22px 0 0;
    background: var(--color-brand-band);
    pointer-events: none;
    transform: translateY(28px);
    opacity: 0;
    transition:
      transform 640ms cubic-bezier(0.16, 1, 0.3, 1) 120ms,
      opacity 540ms ease 120ms;
  }
  .ph-hero.is-ready .ph-coral-slab { transform: translateY(0); opacity: 1; }

  .ph-floor-shadow {
    position: absolute;
    bottom: 6px;
    width: 62%;
    height: 22px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(
      ellipse,
      color-mix(in srgb, var(--color-brand-ink) 32%, transparent) 0%,
      transparent 72%
    );
  }

  .ph-actor-trigger {
    position: relative;
    z-index: 2;
    height: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border-radius: 14px;
  }

  .ph-actor-hop,
  .ph-actor-pointer,
  .ph-actor-breathe {
    position: relative;
    display: flex;
    align-items: flex-end;
    height: 100%;
    transform-origin: center bottom;
  }
  .ph-actor-hop,
  .ph-actor-pointer { will-change: transform; }

  .ph-layer {
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: bottom center;
    user-select: none;
    pointer-events: none;
  }
  .ph-layer-look,
  .ph-layer-blink,
  .ph-layer-arm {
    position: absolute;
    inset: 0;
    margin: auto;
  }
  .ph-layer-look,
  .ph-layer-blink { opacity: 0; }
  .ph-layer-arm {
    transform-origin: 36% 42%;
    will-change: transform;
  }

  /* Click micro-bubble */
  .ph-bubble {
    position: absolute;
    top: 8%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
    white-space: nowrap;
    padding: 7px 12px;
    border-radius: 6px;
    border: 1px solid var(--color-border-strong);
    background: var(--color-surface);
    color: var(--color-text);
    font: 12px/1.2 var(--font-mono);
    box-shadow: 0 8px 20px color-mix(in srgb, var(--color-brand-ink) 12%, transparent);
    animation: ph-bubble-pop 220ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  @keyframes ph-bubble-pop {
    from { opacity: 0; transform: translate(-50%, 6px) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, 0) scale(1); }
  }

  @media (max-width: 900px) {
    .ph-wrap { grid-template-columns: 1fr; gap: 24px; padding-top: 28px; }
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
  }
`;

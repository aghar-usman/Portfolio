"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "motion/react";

interface HeroProps {
  profile: { name: string; roles: string[]; summary: string | string[]; location?: string; headline?: string; intro?: string };
  contact: { resume: string; github: string; linkedin: string };
}

const layers = [
  { label: "Interface", mark: "UI", tools: "React / Next.js", description: "Websites & responsive interfaces" },
  { label: "API", mark: "API", tools: "Python / Flask", description: "Backend services & integrations" },
  { label: "Data", mark: "SQL", tools: "PostgreSQL / SQL", description: "Databases & data pipelines" },
];

function Arrow({ down = false }: { down?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Hero({ profile, contact }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const accent = useRef<SVGPathElement>(null);
  const rule = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const panelId = useId();
  const heading = (profile.headline ?? "Web interfaces. Python backends.").split(". ");
  const intro = profile.intro ?? "I build responsive web apps with React, Next.js, and Python APIs.";

  useEffect(() => {
    const glyph = marker.current;
    if (!glyph || !accent.current || !rule.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({ delay: .2 })
        .fromTo(accent.current, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 1.65, ease: "power2.inOut",
        })
        .fromTo(rule.current, { scaleX: 0 }, {
          scaleX: 1, duration: .9, ease: "power2.out",
        }, 1.12)
        .fromTo(glyph, { opacity: .35, scale: .7 }, {
          opacity: 1, scale: 1, duration: .45, ease: "power2.out",
        }, 1.72);

      const sections = ["skills", "experience", "projects", "education", "contact"]
        .map((id) => document.getElementById(id))
        .filter((section): section is HTMLElement => section !== null);
      const rotate = gsap.quickTo(glyph, "rotation", { duration: .65, ease: "power3.out" });
      const slide = gsap.quickTo(glyph, "y", { duration: .65, ease: "power3.out" });
      let frame = 0;
      const update = () => {
        frame = 0;
        const threshold = window.innerHeight * .52;
        let progress = 0;
        for (const section of sections) {
          const distance = section.getBoundingClientRect().top - threshold;
          progress += gsap.utils.clamp(0, 1, (140 - distance) / 280);
        }
        rotate(progress * 90);
        slide(-30 * Math.sin((progress % 1) * Math.PI));
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(update);
      };
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      update();
      return () => {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        if (frame) cancelAnimationFrame(frame);
      };
    });
    return () => media.revert();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={root} id="about" className="ch-hero" aria-labelledby="ch-title">
        <span ref={marker} className="ch-section-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M3 9V3h6m6 18h6v-6M8 16l8-8" /></svg></span>
        <div className="ch-stage">
          <div className="ch-wrap">
            <div className="ch-main">
              <div className="ch-copy">
                <p className="ch-identity"><span className="ch-name">{profile.name}</span><span className="ch-role">{profile.roles.join(" / ") || "Full-stack developer"}</span></p>
                <h1 id="ch-title" className="ch-title">{heading.map((part, index) => (
                  <span key={index}>
                    {index === 1 ? (
                      <span className="ch-signal-phrase">
                        {part}{index < heading.length - 1 ? "." : ""}
                        <span ref={rule} className="ch-signal-rule" aria-hidden="true" />
                      </span>
                    ) : <>{part}{index < heading.length - 1 ? "." : ""}</>}
                  </span>
                ))}</h1>
                <p className="ch-intro">{intro}</p>
                <div className="ch-actions"><a className="ch-button ch-primary" href="#projects">View projects <Arrow /></a>{contact.resume && <a className="ch-button ch-secondary" href={contact.resume} target="_blank" rel="noopener noreferrer">View résumé <span aria-hidden="true">↗</span></a>}</div>
              </div>

              <div className="ch-visual">
                <div className="ch-scope" aria-hidden="true">
                  <div className="ch-orbit">
                    <svg viewBox="0 0 400 400" fill="none"><circle cx="200" cy="200" r="180" className="ch-outer-ring" /><path ref={accent} d="M200 20A180 180 0 0 1 355.9 110" pathLength="1" className="ch-signal-arc" />{Array.from({ length: 24 }, (_, i) => <line key={i} x1="200" y1="21" x2="200" y2={i % 3 === 0 ? "31" : "26"} transform={"rotate(" + i * 15 + " 200 200)"} className={i % 3 === 0 ? "ch-tick ch-tick-strong" : "ch-tick"} />)}<circle cx="200" cy="200" r="151" className="ch-inner-ring" /><circle cx="200" cy="200" r="151" className="ch-trace" transform="rotate(-90 200 200)" /></svg>
                  </div>
                  
                  <div className="ch-scope-center"><div className="ch-mark-space"><AnimatePresence initial={false} mode="wait"><motion.span className="ch-mark" key={active} initial={{ opacity: reduced ? 1 : .4, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : .4 }} transition={{ duration: reduced ? 0 : .12 }}>{layers[active].mark}</motion.span></AnimatePresence></div><span className="ch-tools">{layers[active].tools}</span></div>
                </div>
                <div className="ch-layer-controls" role="group" aria-label="Explore my development stack">{layers.map((layer, index) => <button type="button" key={layer.label} aria-pressed={active === index} aria-controls={panelId} onClick={() => setActive(index)}>{layer.label}<span className="ch-control-line" /></button>)}</div>
                <p id={panelId} className="ch-layer-description">{layers[active].description}</p>
              </div>
            </div>
            <div className="ch-bottom"><span>{profile.location ?? "Full-stack development"}</span><a href="#skills"><span>Explore my stack</span><Arrow down /></a></div>
          </div>
        </div>
        <style>{HERO_CSS + SIGNAL_CSS}</style>
      </section>
    </MotionConfig>
  );
}

const HERO_CSS = "\n.ch-hero{position:relative;box-sizing:border-box;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);scroll-margin-top:var(--site-header-height,80px)}.ch-hero *{box-sizing:border-box}.ch-stage{position:relative;display:flex;align-items:center;min-height:calc(100svh - var(--site-header-height,80px))}.ch-wrap{width:min(100% - 96px,1248px);margin-inline:auto;padding-block:44px 18px}.ch-main{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:clamp(48px,7vw,112px);align-items:center}.ch-copy{min-width:0}.ch-identity{margin:0 0 30px;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7}.ch-name{color:var(--color-text,#f2f0e9)}.ch-role{color:var(--color-text-muted,#a5a69d);display:inline-flex;align-items:center;gap:12px}.ch-role:before{content:\"\";width:4px;height:4px;border-radius:50%;background:var(--color-accent,#ff744f);flex:none}.ch-title{font-size:clamp(44px,5.5vw,80px);line-height:1.04;font-weight:500;letter-spacing:-.065em;margin:0 0 28px;overflow-wrap:anywhere}.ch-title>span{display:block}.ch-title>span+span{color:var(--color-text-muted,#a5a69d)}.ch-intro{font-size:16px;line-height:1.8;max-width:42ch;color:var(--color-text-muted,#a5a69d);margin:0;text-wrap:pretty}.ch-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}.ch-button{display:inline-flex;align-items:center;justify-content:space-between;gap:24px;min-height:50px;padding:13px 20px;border:1px solid var(--color-border,#30322d);border-radius:4px;font-size:13px;line-height:1.5;font-weight:600;text-decoration:none;transition:transform 150ms,background-color 150ms,border-color 150ms}.ch-primary{background:var(--color-accent,#ff744f);color:#17110d;border-color:transparent}.ch-secondary{color:var(--color-text,#f2f0e9);background:transparent}.ch-button svg{flex:none;transition:transform 150ms}.ch-secondary>span{font-size:18px;line-height:1}.ch-visual{width:100%;max-width:440px;justify-self:end;min-width:0}.ch-scope{position:relative;width:100%;aspect-ratio:1}.ch-orbit{position:absolute;inset:0}.ch-orbit svg{width:100%;height:100%;display:block}.ch-outer-ring,.ch-inner-ring{stroke:var(--color-border,#30322d);stroke-width:1}.ch-tick{stroke:var(--color-border,#30322d);stroke-width:1}.ch-tick-strong{stroke:var(--color-text-muted,#a5a69d)}.ch-trace{stroke:var(--color-accent,#ff744f);stroke-width:1.5;stroke-linecap:round}.ch-scope-center{position:absolute;inset:25% 15%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:4px}.ch-layer-number{font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-accent,#ff744f);font-variant-numeric:tabular-nums}.ch-mark-space{position:relative;height:120px;width:100%;display:flex;align-items:center;justify-content:center}.ch-mark{display:block;font-size:clamp(64px,7.3vw,106px);line-height:1;font-weight:500;letter-spacing:-.075em;color:var(--color-text,#f2f0e9)}.ch-tools{font-family:var(--font-mono,monospace);font-size:10px;line-height:1.8;text-align:center;color:var(--color-text-muted,#a5a69d)}.ch-crosshair{position:absolute;width:12px;height:1px;top:50%;background:var(--color-accent,#ff744f)}.ch-crosshair-left{left:16%}.ch-crosshair-right{right:16%}.ch-layer-controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-top:2px}.ch-layer-controls button{position:relative;min-height:44px;padding:10px 0 16px;border:0;background:none;color:var(--color-text-muted,#a5a69d);font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;cursor:pointer;transition:color 150ms}.ch-control-line{position:absolute;inset-inline:0;bottom:0;height:1px;background:var(--color-border,#30322d)}.ch-control-line:after{content:\"\";position:absolute;inset:0;background:var(--color-accent,#ff744f);transform:scaleX(0);transform-origin:left;transition:transform 180ms cubic-bezier(.2,.8,.2,1)}.ch-layer-controls button[aria-pressed=\"true\"]{color:var(--color-text,#f2f0e9)}.ch-layer-controls button[aria-pressed=\"true\"] .ch-control-line:after{transform:scaleX(1)}.ch-layer-description{text-align:center;font-size:11px;line-height:1.8;color:var(--color-text-muted,#a5a69d);min-height:20px;margin:14px 0 0}.ch-bottom{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:44px;padding-top:16px;border-top:1px solid var(--color-border,#30322d);font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-text-muted,#a5a69d);padding-right:72px}.ch-bottom a{display:inline-flex;align-items:center;gap:14px;min-height:44px;color:inherit;text-decoration:none}.ch-bottom svg{width:14px;height:14px;transition:transform 150ms}.ch-hero a:focus-visible,.ch-hero button:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}\n@media(hover:hover) and (pointer:fine){.ch-button:hover{transform:translateY(-1px)}.ch-primary:hover{background:var(--color-accent-hover,#ff8a6a)}.ch-secondary:hover{border-color:var(--color-text-muted,#a5a69d);background:var(--color-surface,#151713)}.ch-primary:hover svg{transform:translateX(3px)}.ch-layer-controls button:hover{color:var(--color-accent,#ff744f)}.ch-bottom a:hover{color:var(--color-text,#f2f0e9)}.ch-bottom a:hover svg{transform:translateY(3px)}}.ch-button:active{transform:translateY(1px) scale(.985)}\n@media(max-width:1100px){.ch-main{gap:48px}.ch-title{font-size:clamp(44px,5.8vw,64px)}.ch-mark-space{height:100px}.ch-identity{max-width:40ch}.ch-intro{font-size:15px}}\n@media(max-width:1023px){.ch-wrap{width:calc(100% - 64px)}.ch-main{gap:32px}.ch-title{font-size:54px}.ch-visual{max-width:360px}.ch-mark-space{height:92px}.ch-mark{font-size:80px}}\n@media(max-width:959px){.ch-main{grid-template-columns:minmax(0,1fr);gap:32px}.ch-copy{max-width:640px}.ch-title{font-size:clamp(48px,8vw,72px)}.ch-identity{max-width:none}.ch-visual{justify-self:center;max-width:380px}.ch-mark{font-size:92px}.ch-mark-space{height:110px}.ch-intro{max-width:45ch}}\n@media(max-width:639px){.ch-wrap{width:calc(100% - 40px);padding-block:36px 16px}.ch-identity{margin-bottom:24px;font-size:10px;gap:6px 12px}.ch-title{font-size:clamp(40px,10vw,60px);margin-bottom:22px;letter-spacing:-.06em}.ch-intro{font-size:14px;line-height:1.8}.ch-actions{margin-top:24px;gap:10px}.ch-button{width:100%;min-height:48px}.ch-visual{max-width:320px}.ch-mark{font-size:84px}.ch-mark-space{height:96px}.ch-tools{font-size:9px}.ch-layer-controls{gap:16px}.ch-layer-description{font-size:10px}.ch-bottom{margin-top:30px;align-items:flex-start;flex-direction:column;gap:4px;padding-right:60px;font-size:9px}.ch-bottom a{gap:10px}.ch-main{gap:28px}}\n@media(prefers-reduced-motion:reduce){.ch-hero *,.ch-hero *:after{transition:none!important}.ch-button:hover,.ch-button:active,.ch-button svg,.ch-bottom svg{transform:none!important}}\n\n.ch-ambient-arc{stroke:var(--color-accent,#ff744f);stroke-width:2;stroke-linecap:round;opacity:.65}.ch-motion-toggle{display:flex;align-items:center;justify-content:center;gap:10px;min-height:44px;margin:6px auto 0;padding:8px 12px;border:0;background:none;color:var(--color-text-muted,#a5a69d);font-family:var(--font-mono,monospace);font-size:9px;cursor:pointer}.ch-motion-toggle>span{color:var(--color-accent,#ff744f)}@media(prefers-reduced-motion:reduce){.ch-motion-toggle{display:none}}";

const SIGNAL_CSS = `
.ch-title { text-wrap: balance; }
.ch-section-mark { position: fixed; z-index: 3; inset-inline-end: 12px; top: 52vh; width: 20px; height: 20px; color: var(--color-accent, #ff744f); pointer-events: none; }
.ch-section-mark svg { display: block; width: 100%; height: 100%; }
.ch-section-mark path { stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.ch-signal-arc { stroke: var(--color-accent, #ff744f); stroke-width: 2; stroke-linecap: round; stroke-dasharray: 1; }
.ch-signal-phrase { display: inline-block; position: relative; max-width: 100%; }
.ch-signal-rule { position: absolute; inset-inline: 0; bottom: -.09em; height: 2px; background: var(--color-accent, #ff744f); transform-origin: right center; }
@media (max-width: 639px) { .ch-section-mark { inset-inline-end: 4px; width: 12px; height: 12px; } }
`;

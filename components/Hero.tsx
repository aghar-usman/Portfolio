"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, stagger, useAnimate, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

interface HeroProps {
  profile: { name: string; roles: string[]; summary: string | string[]; location?: string; headline?: string; intro?: string };
  contact: { resume: string; github: string; linkedin: string };
}

const stages = [
  { name: "Interface", tools: "React / Next.js", heading: "The part people use.", description: "Responsive interfaces, image galleries and navigation built with React, Next.js and TypeScript.", number: "01" },
  { name: "API", tools: "Python / Flask", heading: "The services behind it.", description: "Python APIs with concurrent requests, pagination, CSV export and safeguards for generated SQL queries.", number: "02" },
  { name: "Data", tools: "PostgreSQL / SQL", heading: "The data underneath.", description: "SQL databases and ETL pipelines with batch loading, timestamp normalization and per-record retries.", number: "03" },
];

function Arrow({ down = false, diagonal = false }: { down?: boolean; diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={down ? "M12 4v16m-6-6 6 6 6-6" : diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Hero({ profile, contact }: HeroProps) {
  const section = useRef<HTMLElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const lastScrollStage = useRef(-1);
  const reduced = useReducedMotion();
  const id = useId();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const trace = useTransform(scrollYProgress, [0, 1], [.08, 1]);
  const intro = profile.intro ?? (Array.isArray(profile.summary) ? profile.summary.join(" ") : profile.summary);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 960px) and (min-height: 800px)");
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const measure = () => {
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-height")) || 80;
      const fits = (wrapper.current?.getBoundingClientRect().height ?? Infinity) <= window.innerHeight - headerHeight;
      setScrollEnabled(media.matches && !preference.matches && fits);
    };
    const observer = new ResizeObserver(measure);
    if (wrapper.current) observer.observe(wrapper.current);
    media.addEventListener("change", measure);
    preference.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); media.removeEventListener("change", measure); preference.removeEventListener("change", measure); window.removeEventListener("resize", measure); };
  }, []);

  useEffect(() => {
    if (!scope.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(".nh-enter", { opacity: [0, 1], y: [12, 0] }, { duration: .65, delay: stagger(.07), ease: [.22, 1, .36, 1] });
    return () => { controls.stop(); };
  }, [animate, scope, reduced]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!scrollEnabled || reduced) return;
    const next = value < .34 ? 0 : value < .7 ? 1 : 2;
    if (next !== lastScrollStage.current) { lastScrollStage.current = next; setActive(next); }
  });

  return (
    <MotionConfig reducedMotion="user">
      <section ref={section} id="about" className="nh-hero" data-scroll={scrollEnabled ? "true" : "false"} aria-labelledby="nh-title">
        <div className="nh-frame" ref={scope}>
          <div ref={wrapper} className="nh-wrap">
            <div className="nh-meta nh-enter"><span className="nh-role"><i aria-hidden="true" />{profile.roles.join(" / ") || "Full-stack developer"}</span>{profile.location && <span className="nh-location">{profile.location}</span>}</div>
            <h1 id="nh-title" className="nh-name nh-enter">{profile.name}<span>.</span></h1>
            <div className="nh-grid">
              <div className="nh-copy nh-enter"><p className="nh-eyebrow">Frontend to backend</p><h2>{profile.headline ?? "Web interfaces. Python backends."}</h2><p className="nh-intro">{intro}</p><div className="nh-actions"><a className="nh-button nh-primary" href="#projects">See my work <Arrow /></a>{contact.resume && <a className="nh-button nh-secondary" href={contact.resume} target="_blank" rel="noopener noreferrer">View résumé <Arrow diagonal /></a>}</div></div>
              <div className="nh-machine">
                <div className="nh-machine-heading"><span>Across the stack</span><span className="nh-stage-counter" aria-hidden="true">{stages[active].number} / 03</span></div>
                <div className="nh-system" role="group" aria-label="Explore the interface, API and data layers">
                  <svg className="nh-circuit" viewBox="0 0 520 300" fill="none" aria-hidden="true">
                    <ellipse cx="260" cy="150" rx="222" ry="104" stroke="currentColor" className="nh-orbit" />
                    <ellipse cx="260" cy="150" rx="176" ry="76" stroke="currentColor" className="nh-orbit nh-orbit-inner" />
                    <path d="M110 68H250Q286 68 286 104V114Q286 150 322 150H411V224Q411 246 389 246H135" className="nh-route-base" />
                    <motion.path d="M110 68H250Q286 68 286 104V114Q286 150 322 150H411V224Q411 246 389 246H135" className="nh-route-trace" style={{ pathLength: scrollEnabled && !reduced ? trace : 1 }} />
                    <circle cx="260" cy="150" r="36" className="nh-core-disc" /><text x="260" y="155" textAnchor="middle" className="nh-core-name">AUKT.</text>
                    <path d="M260 104V114M260 186V197M214 150h10M296 150h10" className="nh-core-ticks" />
                  </svg>
                  {stages.map((stage, index) => <button type="button" key={stage.name} className={"nh-node nh-node-" + index} aria-pressed={active === index} aria-controls={id + "-description"} onClick={() => setActive(index)}><span className="nh-node-number">{stage.number}</span><span className="nh-node-copy"><span className="nh-node-name">{stage.name}</span><span className="nh-node-tools">{stage.tools}</span></span><span className="nh-node-dot" aria-hidden="true" /></button>)}
                </div>
                <div id={id + "-description"} className="nh-stage-description"><AnimatePresence initial={false} mode="wait"><motion.div key={active} initial={{ opacity: reduced ? 1 : .5, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : .5 }} transition={{ duration: reduced ? 0 : .12 }}><h3>{stages[active].heading}</h3><p>{stages[active].description}</p></motion.div></AnimatePresence></div>
              </div>
            </div>
            <div className="nh-bottom nh-enter"><a href="#skills" className="nh-next"><span className="nh-scroll-mark" aria-hidden="true"><Arrow down /></span><span>{scrollEnabled ? "Scroll through the stack" : "See my stack"}</span></a><div className="nh-socials">{contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a>}{contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a>}</div></div>
          </div>
        </div>
        <style>{HERO_CSS}</style>
      </section>
    </MotionConfig>
  );
}

const HERO_CSS = "\n.nh-hero{position:relative;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);scroll-margin-top:var(--site-header-height,80px);box-sizing:border-box}.nh-hero *{box-sizing:border-box}.nh-frame{position:relative;display:flex;align-items:center;min-height:calc(100svh - var(--site-header-height,80px));isolation:isolate}.nh-wrap{width:min(100% - 96px,1248px);margin-inline:auto;padding-block:32px 20px}.nh-meta{display:flex;justify-content:space-between;align-items:baseline;gap:24px;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d)}.nh-role{display:inline-flex;gap:10px;align-items:center;color:var(--color-text,#f2f0e9)}.nh-role i{width:6px;height:6px;flex:none;background:var(--color-accent,#ff744f);border-radius:50%}.nh-location{text-align:right}.nh-name{font-size:clamp(52px,8vw,112px);font-weight:500;letter-spacing:-.072em;line-height:1.08;margin:26px 0 30px;padding-bottom:28px;border-bottom:1px solid var(--color-border,#30322d);overflow-wrap:anywhere;text-wrap:balance}.nh-name>span{color:var(--color-accent,#ff744f)}.nh-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:clamp(40px,6vw,96px);align-items:center}.nh-copy{min-width:0;padding-bottom:8px}.nh-eyebrow{font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-accent,#ff744f);margin:0 0 18px}.nh-copy h2{font-size:clamp(34px,3.3vw,48px);font-weight:500;line-height:1.12;letter-spacing:-.05em;max-width:17ch;text-wrap:balance;margin:0 0 22px}.nh-intro{max-width:44ch;font-size:15px;line-height:1.8;color:var(--color-text-muted,#a5a69d);margin:0;text-wrap:pretty}.nh-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.nh-button{display:inline-flex;justify-content:space-between;align-items:center;gap:24px;padding:13px 20px;min-height:50px;border:1px solid var(--color-border,#30322d);border-radius:4px;font-size:13px;font-weight:600;line-height:1.5;text-decoration:none;transition:transform 150ms,background-color 150ms,border-color 150ms}.nh-primary{background:var(--color-accent,#ff744f);color:#17110d;border-color:transparent}.nh-secondary{color:var(--color-text,#f2f0e9)}.nh-button svg,.nh-socials svg{flex:none;transition:transform 150ms}.nh-machine{min-width:0}.nh-machine-heading{display:flex;justify-content:space-between;gap:24px;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-text-muted,#a5a69d);padding-block:2px 16px}.nh-stage-counter{color:var(--color-accent,#ff744f);font-variant-numeric:tabular-nums}.nh-system{position:relative;aspect-ratio:520/300;min-width:0}.nh-circuit{position:absolute;width:100%;height:100%;inset:0;overflow:visible}.nh-orbit{color:var(--color-border,#30322d);opacity:.7;stroke-width:1}.nh-orbit-inner{stroke-dasharray:2 6;opacity:.6}.nh-route-base{stroke:var(--color-border,#30322d);stroke-width:1.5}.nh-route-trace{stroke:var(--color-accent,#ff744f);stroke-width:1.5;stroke-linecap:round}.nh-core-disc{fill:var(--color-bg,#0c0d0c);stroke:var(--color-border,#30322d)}.nh-core-name{font-family:var(--font-mono,monospace);font-size:13px;fill:var(--color-text,#f2f0e9);letter-spacing:-.7px}.nh-core-ticks{stroke:var(--color-text-muted,#a5a69d);stroke-width:1}.nh-node{position:absolute;display:flex;align-items:center;gap:12px;width:42%;min-height:66px;padding:13px 14px;border:1px solid var(--color-border,#30322d);border-radius:4px;color:var(--color-text,#f2f0e9);background:var(--color-surface,#151713);text-align:left;font-family:inherit;cursor:pointer;transition:background-color 150ms,border-color 150ms}.nh-node-0{top:10%;left:0}.nh-node-1{top:39%;right:0}.nh-node-2{bottom:3%;left:4%}.nh-node-number{font-family:var(--font-mono,monospace);font-size:9px;color:var(--color-text-muted,#a5a69d);flex:none}.nh-node-copy{min-width:0;display:flex;flex-direction:column;gap:5px}.nh-node-name{font-size:16px;line-height:1.25;letter-spacing:-.035em}.nh-node-tools{font-family:var(--font-mono,monospace);font-size:9px;line-height:1.5;color:var(--color-text-muted,#a5a69d);overflow-wrap:anywhere}.nh-node-dot{width:5px;height:5px;border:1px solid var(--color-accent,#ff744f);border-radius:50%;margin-left:auto;flex:none}.nh-node[aria-pressed=\"true\"]{border-color:var(--color-accent,#ff744f);background:var(--color-surface-2,#20231d)}.nh-node[aria-pressed=\"true\"] .nh-node-dot{background:var(--color-accent,#ff744f)}.nh-node[aria-pressed=\"true\"] .nh-node-number{color:var(--color-accent,#ff744f)}.nh-stage-description{min-height:110px;padding-top:24px;padding-left:4%;max-width:48ch}.nh-stage-description h3{font-size:19px;line-height:1.3;font-weight:500;letter-spacing:-.035em;margin:0 0 10px}.nh-stage-description p{font-size:12px;line-height:1.8;color:var(--color-text-muted,#a5a69d);margin:0;text-wrap:pretty}.nh-bottom{display:flex;justify-content:space-between;align-items:center;gap:24px;border-top:1px solid var(--color-border,#30322d);padding-top:14px;margin-top:24px}.nh-next{display:inline-flex;align-items:center;gap:12px;min-height:44px;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;text-decoration:none;color:var(--color-text-muted,#a5a69d)}.nh-scroll-mark{display:grid;place-items:center;width:28px;height:28px;border:1px solid var(--color-border,#30322d);border-radius:50%}.nh-scroll-mark svg{width:13px;height:13px;transition:transform 150ms}.nh-socials{display:flex;gap:24px}.nh-socials a{display:inline-flex;align-items:center;gap:8px;min-height:44px;color:var(--color-text-muted,#a5a69d);font-size:11px;text-decoration:underline;text-decoration-color:transparent;text-underline-offset:5px;transition:color 150ms,text-decoration-color 150ms}.nh-socials svg{width:13px;height:13px}.nh-hero a:focus-visible,.nh-hero button:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}.nh-hero[data-scroll=\"true\"]{height:180svh}.nh-hero[data-scroll=\"true\"] .nh-frame{position:sticky;top:var(--site-header-height,80px);height:calc(100svh - var(--site-header-height,80px));min-height:0}\n@media(hover:hover) and (pointer:fine){.nh-button:hover{transform:translateY(-1px)}.nh-primary:hover{background:var(--color-accent-hover,#ff8a6a)}.nh-secondary:hover{background:var(--color-surface,#151713);border-color:var(--color-text-muted,#a5a69d)}.nh-button:hover svg,.nh-socials a:hover svg{transform:translateX(3px)}.nh-node:hover{border-color:var(--color-text-muted,#a5a69d)}.nh-node[aria-pressed=\"true\"]:hover{border-color:var(--color-accent,#ff744f)}.nh-next:hover,.nh-socials a:hover{color:var(--color-text,#f2f0e9);text-decoration-color:currentColor}.nh-next:hover svg{transform:translateY(3px)}}.nh-button:active{transform:translateY(1px) scale(.985)}\n@media(max-width:1100px){.nh-grid{gap:40px}.nh-node{padding:11px 10px;gap:9px}.nh-node-name{font-size:15px}.nh-node-tools{font-size:8px}.nh-stage-description{min-height:124px}}\n@media(max-width:1023px){.nh-wrap{width:calc(100% - 64px)}.nh-name{font-size:clamp(52px,8vw,88px)}.nh-copy h2{font-size:36px}.nh-intro{font-size:14px}.nh-button{font-size:12px;gap:18px}.nh-grid{gap:32px}}\n@media(max-width:959px){.nh-grid{grid-template-columns:minmax(0,1fr);gap:40px}.nh-copy{max-width:620px}.nh-copy h2{max-width:21ch;font-size:44px}.nh-intro{max-width:56ch}.nh-machine{width:min(100%,560px);margin-inline:auto}.nh-stage-description{min-height:112px}.nh-node-tools{font-size:10px}.nh-node-name{font-size:18px}.nh-node{padding:14px 16px}.nh-name{margin-top:32px}.nh-hero[data-scroll=\"true\"]{height:auto}.nh-hero[data-scroll=\"true\"] .nh-frame{position:relative;height:auto;min-height:calc(100svh - var(--site-header-height,80px))}}\n@media(max-width:639px){.nh-wrap{width:calc(100% - 40px);padding-block:32px 16px}.nh-meta{font-size:10px;gap:16px;align-items:flex-start}.nh-location{max-width:17ch}.nh-name{font-size:clamp(48px,12vw,76px);margin:28px 0;padding-bottom:26px;letter-spacing:-.065em}.nh-copy h2{font-size:36px;max-width:17ch}.nh-eyebrow{margin-bottom:14px}.nh-intro{font-size:14px;line-height:1.8}.nh-actions{margin-top:24px;gap:10px}.nh-button{width:100%;min-height:48px;font-size:13px}.nh-grid{gap:32px}.nh-machine-heading{font-size:10px}.nh-node{gap:8px;padding:10px 9px;min-height:58px;width:43%}.nh-node-name{font-size:14px}.nh-node-tools{font-size:8px}.nh-node-number{font-size:8px}.nh-stage-description{min-height:136px;padding-top:24px}.nh-stage-description h3{font-size:19px}.nh-stage-description p{font-size:12px}.nh-bottom{gap:12px;align-items:flex-start;flex-direction:column;margin-top:16px}.nh-socials{gap:24px}.nh-next{font-size:10px}.nh-core-name{font-size:14px}}\n@media(prefers-reduced-motion:reduce){.nh-hero[data-scroll=\"true\"]{height:auto}.nh-hero[data-scroll=\"true\"] .nh-frame{position:relative;height:auto;min-height:calc(100svh - var(--site-header-height,80px))}.nh-hero *{transition:none!important}.nh-button:hover,.nh-button:active,.nh-button svg,.nh-socials svg,.nh-next svg{transform:none!important}}\n";

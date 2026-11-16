"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, MotionConfig, motion, stagger, useAnimate, useReducedMotion } from "motion/react";

interface HeroProps {
  profile: { name: string; roles: string[]; summary: string | string[]; location?: string; headline?: string; intro?: string };
  contact: { resume: string; github: string; linkedin: string };
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg className="ah-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}


const disciplines = [
  { label: "Interface", tools: "React · Next.js", title: "The part people use.", body: "Responsive pages, project galleries and navigation built with React, Next.js and TypeScript." },
  { label: "API", tools: "Python · Flask", title: "The services behind it.", body: "Python APIs with concurrent request handling, pagination, CSV export and SQL query safeguards." },
  { label: "Data", tools: "PostgreSQL · SQL", title: "The data underneath.", body: "SQL databases and ETL pipelines with batch loading, timestamp normalization and per-record retries." },
];

function StackExplorer() {
  const [active, setActive] = useState(0);
  const id = useId();
  const reduced = useReducedMotion();
  function onKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % disciplines.length;
    else if (event.key === "ArrowLeft") next = (index + disciplines.length - 1) % disciplines.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = disciplines.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }
  return (
    <div className="ah-explorer">
      <div className="ah-explorer-heading"><span>Explore my stack</span><span aria-hidden="true">↳</span></div>
      <div className="ah-tabs" role="tablist" aria-label="Development disciplines">{disciplines.map((item, index) => <button key={item.label} id={id + "-tab-" + index} type="button" role="tab" aria-selected={active === index} aria-controls={id + "-panel"} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={(event) => onKey(event, index)}><span className="ah-tab-number">0{index + 1}</span>{item.label}<span className="ah-tab-line" /></button>)}</div>
      <div id={id + "-panel"} role="tabpanel" aria-labelledby={id + "-tab-" + active} tabIndex={0} className="ah-explorer-panel">
        <svg className="ah-diagram" viewBox="0 0 480 160" fill="none" aria-hidden="true">
          <path d="M130 78H180M300 78H350" className="ah-wire" />
          <path d="M70 44V24H410V44" className="ah-wire ah-return-wire" />
          {disciplines.map((item, index) => <g key={item.label}>
            <rect x={10 + index * 170} y="44" width="120" height="68" rx="4" className={active === index ? "ah-diagram-node ah-diagram-active" : "ah-diagram-node"} />
            <text x={70 + index * 170} y="74" textAnchor="middle" className="ah-diagram-name">{["React", "Flask", "SQL"][index]}</text>
            <text x={70 + index * 170} y="94" textAnchor="middle" className="ah-diagram-sub">{item.label}</text>
            <motion.circle cx={70 + index * 170} cy="130" r="3" initial={false} animate={{ opacity: active === index ? 1 : .18 }} transition={{ duration: reduced ? 0 : .18 }} fill="var(--color-accent, #ff744f)" />
          </g>)}
        </svg>
        <div className="ah-explorer-copy"><AnimatePresence mode="wait" initial={false}><motion.div key={active} initial={{ opacity: reduced ? 1 : .45, y: reduced ? 0 : 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: reduced ? 1 : .45 }} transition={{ duration: reduced ? 0 : .12 }}>
          <p className="ah-explorer-tools">{disciplines[active].tools}</p><h3>{disciplines[active].title}</h3><p className="ah-explorer-description">{disciplines[active].body}</p>
        </motion.div></AnimatePresence></div>
      </div>
    </div>
  );
}



/** Pointer-driven canvas, rendered locally. No perpetual animation loop. */
function ContourBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let width = 0, height = 0, frame = 0, disposed = false;
    const point = { x: .76, y: .65, strength: 0 };
    const target = { x: .76, y: .65, strength: 0 };
    let accent = "#ff744f";
    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = .8;
      context.strokeStyle = accent;
      // Parallel contour lines form a quiet topography behind the content.
      for (let line = 0; line < 23; line++) {
        context.beginPath();
        for (let step = 0; step <= 100; step++) {
          const x = width * step / 100;
          const base = height * .55 + line * 17;
          const arch = Math.sin(x / Math.max(width, 1) * Math.PI * 1.2 - .8) * height * .19;
          const dx = x - point.x * width;
          const dy = base + arch - point.y * height;
          const distance = (dx * dx + dy * dy) / (180 * 180);
          const bend = Math.exp(-distance) * 52 * point.strength;
          const y = base + arch - bend;
          if (step === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.globalAlpha = .09 + (line / 23) * .12;
        context.stroke();
      }
      context.globalAlpha = 1;
    };
    const tick = () => {
      frame = 0;
      if (disposed) return;
      point.x += (target.x - point.x) * .14;
      point.y += (target.y - point.y) * .14;
      point.strength += (target.strength - point.strength) * .12;
      draw();
      if (Math.abs(target.x-point.x) + Math.abs(target.y-point.y) + Math.abs(target.strength-point.strength) > .002) frame = requestAnimationFrame(tick);
    };
    const schedule = () => { if (!frame && !disposed) frame = requestAnimationFrame(tick); };
    const resize = () => {
      const box = host.getBoundingClientRect();
      width = box.width; height = box.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      accent = getComputedStyle(host).getPropertyValue("--color-accent").trim() || "#ff744f";
      draw();
    };
    const move = (event: PointerEvent) => {
      if (preference.matches || !finePointer.matches || event.pointerType === "touch") return;
      const box = host.getBoundingClientRect();
      target.x = (event.clientX - box.left) / Math.max(width, 1);
      target.y = (event.clientY - box.top) / Math.max(height, 1);
      target.strength = 1; schedule();
    };
    const leave = () => { target.strength = 0; schedule(); };
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0; target.strength = 0; point.strength = 0; draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave);
    preference.addEventListener("change", reset);
    finePointer.addEventListener("change", reset);
    resize();
    return () => {
      disposed = true; if (frame) cancelAnimationFrame(frame);
      observer.disconnect(); host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      preference.removeEventListener("change", reset);
      finePointer.removeEventListener("change", reset);
    };
  }, []);
  return <canvas ref={canvasRef} className="ah-contours" aria-hidden="true" />;
}

export default function Hero({ profile, contact }: HeroProps) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!scope.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate("[data-hero-enter]", { opacity: [0, 1], y: [14, 0] }, { duration: .62, delay: stagger(.055), ease: [.22, 1, .36, 1] });
    return () => { controls.stop(); };
  }, [animate, scope, reduced]);
  const intro = profile.intro ?? (Array.isArray(profile.summary) ? profile.summary.join(" ") : profile.summary);
  return (
    <MotionConfig reducedMotion="user">
    <section ref={scope} id="about" className="ah-hero" data-enter aria-labelledby="ah-name">
      <ContourBackground />
      <div className="ah-wrap">
        <div className="ah-meta" data-hero-enter><span className="ah-occupation"><span className="ah-dot" aria-hidden="true" />{profile.roles.join(" / ") || "Developer"}</span>{profile.location && <span className="ah-location">{profile.location}</span>}</div>
        <h1 id="ah-name" className="ah-name" data-hero-enter>{profile.name}<span className="ah-period">.</span></h1>
        <div className="ah-main">
          <div className="ah-copy">
            <h2 className="ah-headline" data-hero-enter>{profile.headline ?? "Web interfaces. Python backends."}</h2>
            <p className="ah-intro" data-hero-enter>{intro}</p>
            <div className="ah-actions" data-hero-enter>
              <a className="ah-button ah-primary" href="#projects">See my work <Arrow /></a>
              {contact.resume && <a className="ah-button ah-secondary" href={contact.resume} target="_blank" rel="noopener noreferrer">View résumé <Arrow diagonal /></a>}
            </div>
          </div>
          <StackExplorer />
        </div>
        <div className="ah-bottom" data-hero-enter><span className="ah-bottom-note">Frontend detail. Backend experience.</span><div className="ah-socials" aria-label="Social profiles">{contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow diagonal /></a>}{contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow diagonal /></a>}</div></div>
      </div>
      <style>{`
.ah-hero{position:relative;isolation:isolate;box-sizing:border-box;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);min-height:calc(100svh - var(--site-header-height,80px));display:flex;align-items:center;overflow:clip;scroll-margin-top:var(--site-header-height,80px)}
.ah-contours{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:-1;mask-image:linear-gradient(90deg,transparent 22%,#000 75%);-webkit-mask-image:linear-gradient(90deg,transparent 22%,#000 75%)}.ah-wrap{position:relative}.ah-hero *{box-sizing:border-box}.ah-wrap{width:min(100% - 96px,1248px);margin-inline:auto;padding-block:64px 28px}
.ah-meta{display:flex;align-items:center;justify-content:space-between;gap:24px;font-family:var(--font-mono,monospace);font-size:12px;line-height:1.6;color:var(--color-text-muted,#a5a69d)}.ah-occupation{display:inline-flex;align-items:center;gap:10px;color:var(--color-text,#f2f0e9)}.ah-dot{width:7px;height:7px;flex:none;background:var(--color-accent,#ff744f);border-radius:50%}.ah-location{text-align:right}
.ah-name{font-size:clamp(54px,8.25vw,118px);font-weight:500;letter-spacing:-.072em;line-height:1.08;margin:36px 0 48px;padding-bottom:40px;border-bottom:1px solid var(--color-border,#30322d);overflow-wrap:anywhere;text-wrap:balance}.ah-period{color:var(--color-accent,#ff744f)}
.ah-main{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.85fr);align-items:start;gap:clamp(48px,8vw,120px)}.ah-headline{max-width:16ch;font-size:clamp(32px,3.3vw,46px);line-height:1.13;font-weight:500;letter-spacing:-.045em;text-wrap:balance;margin:0 0 22px}.ah-intro{max-width:49ch;font-size:16px;line-height:1.75;color:var(--color-text-muted,#a5a69d);margin:0;text-wrap:pretty}
.ah-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:30px}.ah-button{min-height:50px;display:inline-flex;align-items:center;justify-content:center;gap:22px;padding:13px 20px;border:1px solid transparent;border-radius:4px;font-size:14px;font-weight:600;line-height:1.5;text-decoration:none;transition:background-color 150ms,border-color 150ms,color 150ms,transform 150ms}.ah-primary{background:var(--color-accent,#ff744f);color:#17110d}.ah-secondary{border-color:var(--color-border,#30322d);color:var(--color-text,#f2f0e9);background:transparent}.ah-arrow{flex:none;transition:transform 150ms}
.ah-system{padding-top:2px;min-width:0}.ah-layer{transition:background-color 150ms}.ah-layer:hover,.ah-layer:focus-within{background:var(--color-surface,#151713)}.ah-system-top{display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;color:var(--color-text-muted,#a5a69d);font-family:var(--font-mono,monospace);font-size:12px}.ah-system-symbol{color:var(--color-accent,#ff744f);font-size:25px;line-height:1}.ah-layers{list-style:none;margin:0;padding:0}.ah-layer{display:flex;align-items:center;gap:20px;position:relative;min-height:83px;border-top:1px solid var(--color-border,#30322d)}.ah-layer:last-child{border-bottom:1px solid var(--color-border,#30322d)}.ah-index{font-family:var(--font-mono,monospace);font-size:11px;color:var(--color-text-muted,#a5a69d)}.ah-layer-content{display:flex;flex:1;align-items:baseline;justify-content:space-between;gap:14px;min-width:0}.ah-layer-name{font-size:21px;letter-spacing:-.035em}.ah-tools{font-family:var(--font-mono,monospace);font-size:10px;line-height:1.6;color:var(--color-text-muted,#a5a69d);text-align:right}.ah-node{width:7px;height:7px;background:var(--color-bg,#0c0d0c);border:1px solid var(--color-accent,#ff744f);border-radius:50%;position:relative;flex:none}.ah-layer:not(:last-child) .ah-node:after{content:"";position:absolute;width:1px;height:77px;background:var(--color-border,#30322d);top:6px;left:2px;z-index:-1}
.ah-bottom{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:64px;padding-top:18px;border-top:1px solid var(--color-border,#30322d)}.ah-bottom-note{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.6;color:var(--color-text-muted,#a5a69d)}.ah-socials{display:flex;align-items:center;gap:24px}.ah-socials a{display:inline-flex;align-items:center;gap:8px;min-height:44px;color:var(--color-text-muted,#a5a69d);font-size:12px;text-decoration:underline;text-decoration-color:transparent;text-underline-offset:5px;transition:color 150ms,text-decoration-color 150ms}.ah-socials .ah-arrow{width:13px;height:13px}.ah-hero a:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}
@media(hover:hover) and (pointer:fine){.ah-button:hover{transform:translateY(-1px)}.ah-primary:hover{background:var(--color-accent-hover,#ff8a6a)}.ah-secondary:hover{background:var(--color-surface,#151713);border-color:var(--color-text-muted,#a5a69d)}.ah-button:hover .ah-arrow,.ah-socials a:hover .ah-arrow{transform:translateX(3px)}.ah-socials a:hover{color:var(--color-text,#f2f0e9);text-decoration-color:currentColor}}.ah-button:active{transform:translateY(1px) scale(.985)}
@media(max-width:1023px){.ah-wrap{width:calc(100% - 64px);padding-top:48px}.ah-main{gap:40px;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}.ah-layer-content{align-items:flex-start;flex-direction:column;gap:4px}.ah-tools{text-align:left}.ah-name{margin-bottom:36px}.ah-bottom{margin-top:48px}}
@media(max-width:639px){.ah-contours{opacity:.5;mask-image:linear-gradient(180deg,transparent 40%,#000);-webkit-mask-image:linear-gradient(180deg,transparent 40%,#000)}.ah-wrap{width:calc(100% - 40px);padding-block:32px 16px}.ah-meta{font-size:10px;gap:16px;align-items:flex-start}.ah-location{max-width:17ch}.ah-name{font-size:clamp(48px,12vw,76px);letter-spacing:-.065em;margin:30px 0;padding-bottom:28px;max-width:100%}.ah-main{grid-template-columns:1fr;gap:36px}.ah-headline{font-size:34px;max-width:16ch;margin-bottom:16px}.ah-intro{font-size:15px;line-height:1.7}.ah-actions{gap:10px;margin-top:24px}.ah-button{width:100%;justify-content:space-between;min-height:48px}.ah-layer{min-height:66px}.ah-layer-content{flex-direction:row;align-items:baseline}.ah-layer-name{font-size:20px}.ah-tools{font-size:10px;text-align:right}.ah-layer:not(:last-child) .ah-node:after{height:60px}.ah-system-top{padding-bottom:14px}.ah-bottom{margin-top:32px;gap:8px;align-items:flex-start;flex-direction:column;padding-top:16px}.ah-bottom-note{font-size:10px}.ah-socials{gap:24px}.ah-socials a{font-size:12px}}
@media(prefers-reduced-motion:reduce){.ah-hero *,.ah-hero *:before,.ah-hero *:after{animation:none!important;transition:none!important;scroll-behavior:auto!important}.ah-button:hover,.ah-button:active,.ah-hero a .ah-arrow{transform:none!important}}

.ah-explorer{border-top:1px solid var(--color-border,#30322d);min-width:0;padding-top:18px}.ah-explorer-heading{display:flex;justify-content:space-between;align-items:center;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);margin-bottom:22px}.ah-explorer-heading>span:last-child{font-size:23px;color:var(--color-accent,#ff744f)}.ah-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.ah-tabs button{position:relative;display:flex;align-items:center;gap:9px;min-height:48px;text-align:left;padding:0 0 13px;background:none;border:0;color:var(--color-text-muted,#a5a69d);font:inherit;font-size:13px;cursor:pointer;transition:color 150ms}.ah-tab-number{font-family:var(--font-mono,monospace);font-size:9px;opacity:.7}.ah-tab-line{position:absolute;inset-inline:0;bottom:0;height:2px;background:var(--color-border,#30322d)}.ah-tab-line:after{content:"";position:absolute;inset:0;background:var(--color-accent,#ff744f);transform:scaleX(0);transform-origin:left;transition:transform 180ms cubic-bezier(.2,.8,.2,1)}.ah-tabs button[aria-selected="true"]{color:var(--color-text,#f2f0e9)}.ah-tabs button[aria-selected="true"] .ah-tab-line:after{transform:scaleX(1)}.ah-diagram{display:block;width:100%;height:auto;margin-top:8px}.ah-wire{stroke:var(--color-border,#30322d);stroke-width:1}.ah-return-wire{stroke-dasharray:3 5;opacity:.6}.ah-diagram-node{fill:var(--color-surface,#151713);stroke:var(--color-border,#30322d);transition:stroke 160ms,fill 160ms}.ah-diagram-active{stroke:var(--color-accent,#ff744f);fill:var(--color-surface-2,#20231d)}.ah-diagram-name{fill:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);font-size:18px;letter-spacing:-.5px}.ah-diagram-sub{fill:var(--color-text-muted,#a5a69d);font-family:var(--font-mono,monospace);font-size:10px}.ah-explorer-copy{min-height:164px;padding-top:8px}.ah-explorer-tools{font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-accent,#ff744f);margin:0 0 10px}.ah-explorer-copy h3{font-size:22px;font-weight:500;letter-spacing:-.04em;line-height:1.25;margin:0 0 10px}.ah-explorer-description{font-size:13px;color:var(--color-text-muted,#a5a69d);line-height:1.8;margin:0;max-width:43ch}.ah-hero button:focus-visible,.ah-explorer-panel:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}.ah-name{font-size:clamp(54px,8vw,112px);margin-bottom:40px;padding-bottom:32px}.ah-main{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:clamp(48px,6vw,96px)}.ah-bottom{margin-top:36px}.ah-contours{opacity:.65}
@media(hover:hover) and (pointer:fine){.ah-tabs button:hover{color:var(--color-accent,#ff744f)}}
@media(max-width:1023px){.ah-main{gap:36px;grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.ah-tabs{gap:10px}.ah-tabs button{font-size:12px;gap:6px}.ah-explorer-copy{min-height:190px}}
@media(max-width:639px){.ah-name{font-size:clamp(48px,12vw,76px);margin-bottom:30px;padding-bottom:28px}.ah-main{grid-template-columns:minmax(0,1fr);gap:32px}.ah-explorer-copy{min-height:170px}.ah-tabs button{font-size:13px}.ah-diagram{max-width:440px;margin-inline:auto}.ah-explorer-description{font-size:13px}.ah-bottom{margin-top:28px}}

      `}</style>
    </section>
  );
}

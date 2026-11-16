"use client";

import { useEffect, useMemo, useRef } from "react";

export interface SkillGroup { label: string; items: string[] }

export const skillGroups: SkillGroup[] = [
  {
    label: "front end",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
    ],
  },
  {
    label: "backend & apis",
    items: [
      "Python",
      "Flask",
      "FastAPI",
      "REST APIs",
      "Token-based auth",
      "Rate limiting",
      "Java",
      "C",
    ],
  },
  {
    label: "ai & llms",
    items: [
      "LLM Integration",
      "Text-to-SQL",
      "Prompt Engineering",
      "Ollama",
      "Llama 3",
      "Mistral",
      "Claude",
      "HuggingFace",
      "TensorFlow",
      "PyTorch",
      "OpenCV",
    ],
  },
  {
    label: "databases & data",
    items: [
      "PostgreSQL",
      "MSSQL",
      "MySQL",
      "SQLite",
      "SQL (Joins, CTEs, Subqueries)",
      "ETL Pipelines",
      "Pandas",
      "NumPy",
      "Data Validation",
    ],
  },
  {
    label: "tools & cloud",
    items: ["Git/GitHub", "Docker", "Linux", "GCP", "CI/CD", "Vercel"],
  },
  {
    label: "languages",
    items: ["Python", "TypeScript", "JavaScript", "Java", "C", "SQL"],
  },
];

interface SkillsProps {
  skills?: SkillGroup[];
  disableAnimations?: boolean;
  /** Legacy effect props remain accepted so existing call sites still compile.
   * The new section deliberately does not run these effects. */
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Skills({ skills = skillGroups, disableAnimations = false }: SkillsProps) {
  const root = useRef<HTMLElement>(null);
  const moment = useRef<HTMLDivElement>(null);
  // No positional assumptions: every supplied group appears, in its original order.
  const visibleGroups = useMemo(() => skills.map((group) => ({
    label: group.label,
    items: Array.from(new Set(group.items.map((item) => item.trim()).filter(Boolean))),
  })).filter((group) => group.items.length > 0), [skills]);

  useEffect(() => {
    const section = root.current;
    const heading = moment.current;
    if (!section || !heading || disableAnimations) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let attached = false;
    const update = () => {
      frame = 0;
      const rect = heading.getBoundingClientRect();
      // A single heading moment; lists never reveal, move or disappear on scroll.
      const start = window.innerHeight * .85;
      const finish = window.innerHeight * .3;
      const progress = Math.max(0, Math.min(1, (start - rect.top) / Math.max(1, start - finish)));
      heading.style.setProperty("--as-progress", String(progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const configure = () => {
      if (attached) {
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        attached = false;
      }
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      if (preference.matches) { heading.style.setProperty("--as-progress", "1"); return; }
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      attached = true;
      update();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(section);
    preference.addEventListener("change", configure);
    configure();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", configure);
      heading.style.removeProperty("--as-progress");
    };
  }, [disableAnimations]);

  return (
    <section ref={root} id="skills" className="as-section" aria-labelledby="as-heading" data-motion={disableAnimations ? "off" : undefined}>
      <div className="as-wrap">
        <div className="as-heading-block" ref={moment} data-moment="word-highlight">
          <div className="as-section-label"><span className="as-section-index">01 /</span><span>Stack</span><span className="as-connector" aria-hidden="true"><span /></span></div>
          <div className="as-heading-row">
            <h2 id="as-heading">The tools behind<br /><span className="as-highlight">the work.</span></h2>
            <p>From the interface to the API<br className="as-desktop-break" /> and the data underneath.</p>
          </div>
        </div>

        {visibleGroups.length > 0 ? <div className="as-grid">
          {visibleGroups.map((group, index) => <article className="as-group" key={group.label + index}>
            <div className="as-group-heading"><span className="as-group-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{group.label}</h3></div>
            <ul className="as-items" aria-label={group.label}>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>)}
        </div> : <p className="as-empty">My projects show the tools I work with.</p>}

        <div className="as-footer"><p>See these tools in the projects.</p><a href="#projects">View projects <Arrow /></a></div>
      </div>
      <style>{SKILLS_CSS}</style>
    </section>
  );
}

const SKILLS_CSS = "\n.as-section{position:relative;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);scroll-margin-top:var(--site-header-height,80px);min-height:calc(100svh - var(--site-header-height,80px));padding-block:72px 40px;box-sizing:border-box}.as-section *{box-sizing:border-box}.as-wrap{width:min(100% - 96px,1248px);margin-inline:auto}.as-heading-block{--as-progress:1}.as-section-label{display:flex;align-items:center;gap:12px;font-family:var(--font-mono,monospace);font-size:12px;line-height:1.6;color:var(--color-text-muted,#a5a69d);margin-bottom:32px}.as-section-index{color:var(--color-accent,#ff744f)}.as-connector{width:64px;height:1px;background:var(--color-border,#30322d);margin-left:6px;overflow:hidden}.as-connector>span{display:block;width:100%;height:100%;background:var(--color-accent,#ff744f);transform:scaleX(var(--as-progress));transform-origin:left}.as-heading-row{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;padding-bottom:44px}.as-heading-row h2{margin:0;font-size:clamp(40px,4.4vw,62px);font-weight:500;letter-spacing:-.055em;line-height:1.08;text-wrap:balance}.as-highlight{color:var(--color-accent,#ff744f);color:color-mix(in srgb,var(--color-text-muted,#a5a69d),var(--color-accent,#ff744f) calc(var(--as-progress)*100%))}.as-heading-row p{margin:0 0 4px;font-size:15px;line-height:1.75;color:var(--color-text-muted,#a5a69d);max-width:32ch}.as-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:36px;row-gap:0}.as-group{min-width:0;padding-block:26px 32px;border-top:1px solid var(--color-border,#30322d)}.as-group-heading{display:flex;align-items:baseline;gap:14px;margin-bottom:20px}.as-group-index{font-family:var(--font-mono,monospace);font-size:10px;color:var(--color-text-muted,#a5a69d);flex:none}.as-group h3{margin:0;font-size:18px;line-height:1.4;font-weight:500;letter-spacing:-.025em}.as-items{display:flex;flex-wrap:wrap;align-content:flex-start;gap:8px;list-style:none;padding:0;margin:0}.as-items li{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.6;border:1px solid var(--color-border,#30322d);background:var(--color-surface,#151713);color:var(--color-text-muted,#a5a69d);border-radius:4px;padding:6px 9px;overflow-wrap:anywhere;max-width:100%;transition:color 150ms,border-color 150ms,background-color 150ms}.as-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-top:18px;border-top:1px solid var(--color-border,#30322d);margin-top:8px}.as-footer p,.as-empty{margin:0;font-size:12px;line-height:1.7;color:var(--color-text-muted,#a5a69d)}.as-footer a{display:inline-flex;align-items:center;gap:16px;min-height:44px;font-size:12px;font-weight:500;color:var(--color-text,#f2f0e9);text-decoration:underline;text-decoration-color:var(--color-border,#30322d);text-underline-offset:5px;transition:color 150ms,text-decoration-color 150ms}.as-footer svg{transition:transform 150ms}.as-footer a:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}.as-empty{padding-bottom:40px}\n@media(hover:hover) and (pointer:fine){.as-items li:hover{color:var(--color-text,#f2f0e9);border-color:var(--color-text-muted,#a5a69d);background:var(--color-surface-2,#20231d)}.as-footer a:hover{color:var(--color-accent,#ff744f);text-decoration-color:currentColor}.as-footer a:hover svg{transform:translateX(3px)}}\n@media(max-width:1023px){.as-wrap{width:calc(100% - 64px)}.as-section{padding-top:56px}.as-grid{grid-template-columns:repeat(2,minmax(0,1fr));column-gap:32px}.as-heading-row{gap:32px}.as-heading-row h2{font-size:48px}.as-heading-row p{font-size:14px;max-width:26ch}.as-desktop-break{display:none}}\n@media(max-width:639px){.as-wrap{width:calc(100% - 40px)}.as-section{padding-block:40px 24px}.as-section-label{margin-bottom:24px;font-size:11px}.as-heading-row{flex-direction:column;align-items:flex-start;gap:20px;padding-bottom:32px}.as-heading-row h2{font-size:42px}.as-heading-row p{max-width:32ch;font-size:14px}.as-grid{grid-template-columns:minmax(0,1fr)}.as-group{padding-block:24px 28px}.as-group-heading{margin-bottom:16px}.as-items{gap:8px}.as-items li{font-size:11px;padding:7px 10px}.as-footer{align-items:flex-start;flex-direction:column;gap:6px;padding-top:20px}.as-footer p{font-size:11px}}\n.as-section[data-motion=\"off\"] .as-heading-block{--as-progress:1!important}.as-section[data-motion=\"off\"] *{transition:none!important}.as-section[data-motion=\"off\"] .as-footer svg{transform:none!important}\n@media(prefers-reduced-motion:reduce){.as-heading-block{--as-progress:1!important}.as-section *{transition:none!important}.as-footer svg{transform:none!important}}\n";

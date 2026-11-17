"use client";

import { useMemo } from "react";

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

export default function Skills({ skills = skillGroups, disableAnimations = false }: SkillsProps) {
  const groups = useMemo(() => skills.map((group) => ({ label: group.label, items: Array.from(new Set(group.items.map((item) => item.trim()).filter(Boolean))) })).filter((group) => group.items.length), [skills]);
  return (
    <section id="skills" className="cs-section" data-motion={disableAnimations ? "off" : undefined} aria-labelledby="cs-title">
      <div className="cs-wrap">
        <div className="cs-label"><span>01 /</span>Stack</div>
        <div className="cs-heading"><h2 id="cs-title">My stack<span>.</span></h2><p>Tools I use across my projects.</p></div>
        <div className="cs-grid">{groups.map((group, index) => <article className="cs-group" key={group.label + index}>
          <div className="cs-group-heading"><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{group.label}</h3></div>
          <ul className="cs-tools" aria-label={group.label}>{group.items.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
          {group.items.length > 5 && <details className="cs-more"><summary><span>More tools ({group.items.length - 5})</span><span className="cs-plus" aria-hidden="true" /></summary><ul className="cs-tools cs-extra" aria-label={"Additional " + group.label + " tools"}>{group.items.slice(5).map((item) => <li key={item}>{item}</li>)}</ul></details>}
        </article>)}</div>
        {!groups.length && <p className="cs-empty">My projects show the tools I work with.</p>}
        <div className="cs-footer"><span>See the stack in use.</span><a href="#projects">View projects <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a></div>
      </div>
      <style>{SKILLS_CSS}</style>
    </section>
  );
}

const SKILLS_CSS = "\n.cs-section{box-sizing:border-box;position:relative;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);padding-block:72px 32px;scroll-margin-top:var(--site-header-height,80px)}.cs-section *{box-sizing:border-box}.cs-wrap{width:min(100% - 96px,1248px);margin-inline:auto}.cs-label{display:flex;gap:12px;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);margin-bottom:24px}.cs-label>span{color:var(--color-accent,#ff744f)}.cs-heading{display:flex;align-items:baseline;justify-content:space-between;gap:32px;margin-bottom:40px}.cs-heading h2{font-size:clamp(38px,4.3vw,60px);line-height:1.1;font-weight:500;letter-spacing:-.055em;margin:0}.cs-heading h2 span{color:var(--color-accent,#ff744f)}.cs-heading p{font-size:14px;line-height:1.8;color:var(--color-text-muted,#a5a69d);margin:0}.cs-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0 44px;align-items:start}.cs-group{min-width:0;border-top:1px solid var(--color-border,#30322d);padding-block:24px 32px}.cs-group-heading{display:flex;align-items:baseline;gap:14px;margin-bottom:18px}.cs-group-heading>span{font-family:var(--font-mono,monospace);font-size:10px;color:var(--color-accent,#ff744f)}.cs-group h3{font-size:18px;line-height:1.5;font-weight:500;letter-spacing:-.03em;margin:0}.cs-tools{list-style:none;margin:0;padding:0;display:grid;gap:8px}.cs-tools li{font-size:14px;line-height:1.7;color:var(--color-text-muted,#a5a69d);overflow-wrap:anywhere}.cs-more{margin-top:14px}.cs-more summary{display:inline-flex;align-items:center;gap:12px;min-height:44px;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-text-muted,#a5a69d);cursor:pointer;list-style:none;transition:color 150ms}.cs-more summary::-webkit-details-marker{display:none}.cs-more summary::marker{content:\"\"}.cs-plus{position:relative;width:10px;height:10px;color:var(--color-accent,#ff744f)}.cs-plus:before,.cs-plus:after{content:\"\";position:absolute;background:currentColor}.cs-plus:before{width:10px;height:1px;top:4px;left:0}.cs-plus:after{width:1px;height:10px;left:4px;top:0;transform:scaleY(1);transition:transform 150ms}.cs-more[open] .cs-plus:after{transform:scaleY(0)}.cs-extra{padding-block:6px 0}.cs-footer{border-top:1px solid var(--color-border,#30322d);padding-top:16px;display:flex;align-items:center;justify-content:space-between;gap:24px}.cs-footer>span,.cs-empty{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.8;color:var(--color-text-muted,#a5a69d)}.cs-footer a{min-height:44px;display:inline-flex;align-items:center;gap:16px;color:var(--color-text,#f2f0e9);font-size:12px;text-decoration:underline;text-decoration-color:var(--color-border,#30322d);text-underline-offset:5px;transition:color 150ms}.cs-footer svg{transition:transform 150ms}.cs-footer a:focus-visible,.cs-more summary:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}.cs-empty{margin:0 0 32px}\n@media(hover:hover) and (pointer:fine){.cs-more summary:hover,.cs-footer a:hover{color:var(--color-accent,#ff744f)}.cs-footer a:hover svg{transform:translateX(3px)}}\n@media(max-width:1023px){.cs-wrap{width:calc(100% - 64px)}.cs-section{padding-top:56px}.cs-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:0 32px}}\n@media(max-width:639px){.cs-wrap{width:calc(100% - 40px)}.cs-section{padding-block:40px 24px}.cs-heading{flex-direction:column;align-items:flex-start;gap:14px;margin-bottom:28px}.cs-heading h2{font-size:42px}.cs-heading p{font-size:13px}.cs-grid{grid-template-columns:minmax(0,1fr)}.cs-group{padding-block:22px 26px}.cs-tools{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 20px}.cs-tools li{font-size:13px}.cs-group h3{font-size:18px}.cs-footer{gap:16px;padding-right:56px;align-items:flex-start;flex-direction:column}.cs-footer>span{font-size:10px}}\n.cs-section[data-motion=\"off\"] *,.cs-section[data-motion=\"off\"] *:after{transition:none!important}.cs-section[data-motion=\"off\"] .cs-footer svg{transform:none!important}\n@media(prefers-reduced-motion:reduce){.cs-section *,.cs-section *:after{transition:none!important}.cs-footer svg{transform:none!important}}\n";

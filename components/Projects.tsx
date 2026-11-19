"use client";

import { useEffect, useId, useRef, useState } from "react";
import { stagger, useAnimate, useReducedMotion } from "motion/react";

export interface ProjectEntry {
  name: string;
  tagline: string;
  period: string;
  points: string[];
  stack: string[];
  github?: string;
  live?: string;
  /** Optional local image, e.g. /images/suen-studio.webp. */
  screenshot?: { src: string; alt: string };
}

interface ProjectsProps { projects: ProjectEntry[] }

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function ProjectPreview({ project }: { project: ProjectEntry }) {
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    if (!expanded) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);
  let previewHostname = "";
  try { if (project.live) previewHostname = new URL(project.live).hostname; } catch {}
  const preview = project.screenshot ?? (previewHostname === "suen-studio.vercel.app" ? {
    src: "/suen-studio-preview.jpg",
    alt: "SU·EN Studio homepage with its architecture portfolio introduction and a Kerala home",
  } : previewHostname === "aghar-portfolio.vercel.app" ? {
    src: "/portfolio-site-preview.jpg",
    alt: "Aghar’s portfolio homepage with an exploded diagram of a web application",
  } : undefined);
  if (!preview || failed) return <ProjectPoster project={project} />;
  function openPreview() { dialog.current?.showModal(); setExpanded(true); }
  function closePreview() { dialog.current?.close(); setExpanded(false); }
  return <div className="ap-image-frame">
    <div className="ap-preview-bar"><span>{project.name}</span><button type="button" onClick={openPreview}>Open preview <span aria-hidden="true">↗</span></button></div>
    <button type="button" className="ap-preview-button" onClick={openPreview} aria-label={"Open " + project.name + " screenshot"}><img src={preview.src} alt={preview.alt} width={1200} height={750} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => { dialog.current?.close(); setExpanded(false); setFailed(true); }} /></button>
    <dialog ref={dialog} className="ap-preview-dialog" aria-labelledby={titleId} onClose={() => setExpanded(false)} onClick={(event) => { if (event.target === event.currentTarget) closePreview(); }}>
      <div className="ap-lightbox"><div className="ap-lightbox-bar"><h4 id={titleId}>{project.name}</h4><button type="button" onClick={closePreview} autoFocus>Close <span aria-hidden="true">×</span></button></div><div className="ap-lightbox-image"><img src={preview.src} alt={preview.alt} width={1200} height={750} decoding="async" referrerPolicy="no-referrer" /></div>{project.live && <a className="ap-lightbox-link" href={project.live} target="_blank" rel="noopener noreferrer">Open live website ↗</a>}</div>
    </dialog>
  </div>;
}

function ProjectPoster({ project }: { project: ProjectEntry }) {
  const isAgriLeaf = project.name === "AgriLeaf Pro";
  return (
    <div className="ap-poster">
      {isAgriLeaf && (
        <svg viewBox="0 0 280 235" fill="none" aria-hidden="true">
          <path className="ap-leaf-guides" d="M18 50V18h32m180 0h32v32m0 135v32h-32m-180 0H18v-32M18 117h244M140 18v199" />
          <path d="M74 173C39 101 105 54 220 34c-6 97-34 154-97 154-20 0-36-5-49-15ZM59 208l122-124m-77 78 66-7m-36-27 13-55" />
          <path className="ap-leaf-guides" d="M131 105h72v54h-72Z" />
        </svg>
      )}
      <div>
        <p className="ap-poster-label">{project.tagline}</p>
        <p className="ap-poster-title">{project.name}</p>
        {project.points[0] && <p className="ap-poster-summary">{project.points[0]}</p>}
      </div>
    </div>
  );
}

function ProjectReel({ projects }: ProjectsProps) {
  const [selection, setSelection] = useState(0);
  const panelId = useId();
  const selected = projects[selection] ?? projects[0];
  if (!selected) return null;

  return (
    <div className="ap-reel">
      <div className="ap-reel-index" role="group" aria-label="Choose a project preview">
        {projects.map((project, index) => (
          <button
            key={project.name + project.period + index}
            type="button"
            aria-controls={panelId}
            aria-pressed={project === selected}
            onPointerEnter={(event) => { if (event.pointerType === "mouse") setSelection(index); }}
            onFocus={() => setSelection(index)}
            onClick={() => setSelection(index)}
          >
            <span className="ap-reel-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span>{project.name}</span>
            <Arrow />
          </button>
        ))}
      </div>
      <div className="ap-reel-window" id={panelId} role="region" aria-label={selected.name + " preview"}>
        <div className="ap-reel-frame" key={selected.name + selected.period + selection}>
          <ProjectPreview project={selected} />
        </div>
      </div>
    </div>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduced = useReducedMotion();
  return (
    <section ref={scope} id="projects" data-portfolio-chapter="" className="ap-section" aria-labelledby="ap-title">
      <div className="ap-wrap">
        <div className="ap-label" data-portfolio-beat="chapter"><span>03 /</span>Projects<i aria-hidden="true" /><span data-portfolio-dock="" aria-hidden="true" /></div>
        <div className="ap-heading-row">
          <h2 id="ap-title">Selected projects<span>.</span></h2>
          <p>An architecture website, this portfolio,<br className="ap-desktop-break" /> and a plant disease detector.</p>
        </div>

        <ProjectReel projects={projects} />
        <div className="ap-list">
          {projects.map((project, index) => (
            <article className={index === 0 ? "ap-project ap-project-featured" : "ap-project"} key={project.name + project.period + index} aria-labelledby={"ap-project-" + index}>

              <div className="ap-project-top"><span className="ap-number">{String(index + 1).padStart(2, "0")} /</span><span className="ap-period">{project.period}</span></div>
              <div className="ap-project-grid">
                <div className="ap-identity" data-portfolio-beat="project">
                  <h3 id={"ap-project-" + index}>{project.name}</h3>
                  <p className="ap-tagline">{project.tagline}</p>
                  {(project.live || project.github) && <div className="ap-actions">
                    {project.live && <a className="ap-link ap-live" href={project.live} target="_blank" rel="noopener noreferrer" aria-label={"View " + project.name + " website (opens in a new tab)"}>View site <Arrow /></a>}
                    {project.github && <a className="ap-link ap-source" href={project.github} target="_blank" rel="noopener noreferrer" aria-label={"View " + project.name + " source code (opens in a new tab)"}>View code <Arrow /></a>}
                  </div>}
                  {project.stack.length > 0 && <ul className="ap-stack" aria-label={project.name + " technologies"}>{Array.from(new Set(project.stack)).map((tech) => <li key={tech}>{tech}</li>)}</ul>}
                </div>

                <div className="ap-body">
                  {project.points[0] && <p className="ap-overview">{project.points[0]}</p>}
                  {project.points.length > 1 && <details className="ap-details" onToggle={(event) => {
                    if (!event.currentTarget.open || reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                    animate(event.currentTarget.querySelectorAll(".ap-points li"), { opacity: [.65, 1], y: [4, 0] }, { duration: .24, delay: stagger(.035), ease: [.22, 1, .36, 1] });
                  }}>
                    <summary><span>How I built it</span><span className="ap-disclosure-icon" aria-hidden="true" /></summary>
                    <ul className="ap-points">{project.points.slice(1).map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ul>
                  </details>}
                </div>
              </div>


            </article>
          ))}
          {projects.length === 0 && <p className="ap-empty">No projects are listed yet.</p>}
        </div>
      </div>
      <style>{PROJECTS_CSS + REEL_CSS}</style>
    </section>
  );
}

const PROJECTS_CSS = "\n.ap-section{position:relative;box-sizing:border-box;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);padding-block:72px 40px;min-height:calc(100svh - var(--site-header-height,80px));scroll-margin-top:var(--site-header-height,80px)}.ap-section *{box-sizing:border-box}.ap-wrap{width:min(100% - 96px,1248px);margin-inline:auto}.ap-label{display:flex;align-items:center;gap:12px;font-family:var(--font-mono,monospace);font-size:12px;line-height:1.6;color:var(--color-text-muted,#a5a69d);margin-bottom:32px}.ap-label>span{color:var(--color-accent,#ff744f)}.ap-label i{display:block;width:64px;height:1px;margin-left:6px;background:var(--color-border,#30322d)}.ap-heading-row{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;padding-bottom:48px}.ap-heading-row h2{font-size:clamp(40px,4.4vw,62px);font-weight:500;letter-spacing:-.055em;line-height:1.08;margin:0;text-wrap:balance}.ap-heading-row h2>span{color:var(--color-accent,#ff744f)}.ap-heading-row>p{font-size:15px;line-height:1.75;color:var(--color-text-muted,#a5a69d);margin:0 0 4px;max-width:32ch}.ap-list{border-bottom:1px solid var(--color-border,#30322d)}.ap-project{padding-block:28px 44px;border-top:1px solid var(--color-border,#30322d)}.ap-project-top{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:28px;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.6}.ap-number{color:var(--color-accent,#ff744f)}.ap-period{color:var(--color-text-muted,#a5a69d)}.ap-project-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(40px,7vw,112px);align-items:start}.ap-identity,.ap-body{min-width:0}.ap-identity h3{font-size:36px;font-weight:500;letter-spacing:-.05em;line-height:1.12;overflow-wrap:anywhere;margin:0 0 16px}.ap-project-featured .ap-identity h3{font-size:clamp(40px,4vw,56px)}.ap-tagline{font-size:15px;line-height:1.75;color:var(--color-text-muted,#a5a69d);max-width:42ch;margin:0}.ap-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:24px}.ap-link{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:18px;padding:10px 16px;border:1px solid var(--color-border,#30322d);border-radius:4px;color:var(--color-text,#f2f0e9);text-decoration:none;font-size:12px;font-weight:600;line-height:1.5;transition:background-color 150ms,border-color 150ms,color 150ms,transform 150ms}.ap-live{background:var(--color-accent,#ff744f);border-color:transparent;color:#17110d}.ap-link svg{flex:none;transition:transform 150ms}.ap-stack{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:24px 0 0}.ap-stack li{border:1px solid var(--color-border,#30322d);border-radius:4px;background:var(--color-surface,#151713);padding:6px 9px;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.6;color:var(--color-text-muted,#a5a69d);max-width:100%;overflow-wrap:anywhere}.ap-overview{font-size:18px;line-height:1.75;letter-spacing:-.015em;margin:0;text-wrap:pretty;color:var(--color-text,#f2f0e9)}.ap-details{margin-top:24px;border-top:1px solid var(--color-border,#30322d)}.ap-details summary{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:52px;list-style:none;cursor:pointer;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);transition:color 150ms}.ap-details summary::-webkit-details-marker{display:none}.ap-details summary::marker{content:\"\"}.ap-disclosure-icon{position:relative;width:12px;height:12px;flex:none;color:var(--color-accent,#ff744f)}.ap-disclosure-icon:before,.ap-disclosure-icon:after{content:\"\";position:absolute;background:currentColor}.ap-disclosure-icon:before{height:1px;width:12px;left:0;top:5px}.ap-disclosure-icon:after{height:12px;width:1px;top:0;left:5px;transform:scaleY(1);transition:transform 150ms}.ap-details[open] .ap-disclosure-icon:after{transform:scaleY(0)}.ap-details[open] summary{color:var(--color-text,#f2f0e9)}.ap-points{margin:4px 0 0;padding-left:17px;display:grid;gap:14px}.ap-points li{font-size:14px;line-height:1.8;color:var(--color-text-muted,#a5a69d);padding-left:6px;overflow-wrap:anywhere}.ap-points li::marker{color:var(--color-accent,#ff744f);font-size:10px}.ap-image-frame{margin-top:32px;overflow:hidden;border:1px solid var(--color-border,#30322d);border-radius:4px;background:var(--color-surface,#151713)}.ap-image-frame a{display:block;overflow:hidden}.ap-image-frame img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:contain;object-position:top;transition:transform 600ms cubic-bezier(.2,.8,.2,1)}.ap-section a:focus-visible,.ap-details summary:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}.ap-image-frame a:focus-visible{outline-offset:-4px}.ap-empty{font-size:15px;line-height:1.7;color:var(--color-text-muted,#a5a69d);padding-bottom:32px;margin:0}\n@media(hover:hover) and (pointer:fine){.ap-link:hover{transform:translateY(-1px)}.ap-live:hover{background:var(--color-accent-hover,#ff8a6a)}.ap-source:hover{border-color:var(--color-text-muted,#a5a69d);background:var(--color-surface,#151713)}.ap-link:hover svg{transform:translateX(3px)}.ap-details summary:hover{color:var(--color-text,#f2f0e9)}.ap-image-frame a:hover img{transform:scale(1.02)}}.ap-link:active{transform:translateY(1px) scale(.985)}\n@media(max-width:1023px){.ap-wrap{width:calc(100% - 64px)}.ap-section{padding-top:56px}.ap-heading-row{gap:32px;padding-bottom:40px}.ap-heading-row h2{font-size:48px}.ap-heading-row>p{font-size:14px;max-width:26ch}.ap-desktop-break{display:none}.ap-project-grid{gap:40px}.ap-overview{font-size:17px}.ap-identity h3{font-size:32px}}\n@media(max-width:639px){.ap-wrap{width:calc(100% - 40px)}.ap-section{padding-block:40px 24px}.ap-label{margin-bottom:24px;font-size:11px}.ap-heading-row{flex-direction:column;align-items:flex-start;gap:20px;padding-bottom:32px}.ap-heading-row h2{font-size:42px}.ap-heading-row>p{font-size:14px;max-width:32ch}.ap-project{padding-block:24px 32px}.ap-project-top{margin-bottom:24px;font-size:10px}.ap-project-grid{grid-template-columns:minmax(0,1fr);gap:28px}.ap-identity h3{font-size:32px}.ap-project-featured .ap-identity h3{font-size:40px}.ap-tagline{font-size:14px}.ap-actions{gap:10px;margin-top:20px}.ap-link{min-height:48px;justify-content:space-between;flex:1 1 140px}.ap-stack{margin-top:20px}.ap-overview{font-size:16px;line-height:1.8}.ap-details{margin-top:20px}.ap-points li{font-size:14px}.ap-image-frame{margin-top:28px}}\n@media(prefers-reduced-motion:reduce){.ap-section *,.ap-section *:before,.ap-section *:after{transition:none!important}.ap-link:hover,.ap-link:active,.ap-link svg,.ap-image-frame img{transform:none!important}}\n\n.ap-image-frame{position:relative;margin:0 0 30px;border-radius:6px;overflow:hidden;background:var(--color-surface,#151713)}.ap-image-frame a{position:relative;display:block}.ap-image-frame img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;object-position:top}.ap-image-action{position:absolute;right:20px;bottom:20px;display:inline-flex;align-items:center;min-height:44px;padding:10px 16px;border:1px solid #ffffff33;border-radius:4px;background:#0c0d0ce8;color:#f2f0e9;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7}.ap-project-featured{padding-top:24px}.ap-project-featured .ap-image-frame img{aspect-ratio:16/9}.ap-project-top{margin-bottom:24px}.ap-stack{gap:6px}.ap-stack li{background:transparent;border-color:transparent;padding:4px 0;margin-right:14px}.ap-project-grid{gap:clamp(36px,6vw,96px)}.ap-overview{font-size:17px;line-height:1.8}.ap-heading-row>p{font-size:14px}.ap-label i{display:none}\n@media(max-width:639px){.ap-image-frame{margin-bottom:24px}.ap-image-action{right:12px;bottom:12px;font-size:10px;padding:8px 12px}.ap-project-featured .ap-image-frame img{aspect-ratio:4/3}.ap-overview{font-size:15px}.ap-project-featured .ap-identity h3{font-size:36px}.ap-stack li{font-size:10px;margin-right:10px}}\n\n.ap-image-frame,.ap-project-featured .ap-image-frame{overflow:hidden;background:var(--color-surface,#151713);border:1px solid var(--color-border,#30322d);border-radius:6px}.ap-preview-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:6px 18px;border-bottom:1px solid var(--color-border,#30322d);font-family:var(--font-mono,monospace);font-size:10px;color:var(--color-text-muted,#a5a69d)}.ap-preview-bar button,.ap-lightbox-bar button{display:inline-flex;align-items:center;gap:14px;min-height:44px;padding:8px 0;background:none;border:0;color:var(--color-text,#f2f0e9);font:inherit;cursor:pointer}.ap-preview-button{display:block;width:100%;border:0;padding:0;background:none;cursor:zoom-in}.ap-image-frame .ap-preview-button img,.ap-project-featured .ap-image-frame .ap-preview-button img{display:block;width:100%;height:auto;max-height:none;aspect-ratio:auto;object-fit:contain;transform:none!important;transition:none}.ap-preview-dialog{width:min(1440px,calc(100vw - 32px));max-width:none;max-height:calc(100dvh - 32px);border:1px solid var(--color-border,#30322d);border-radius:6px;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);padding:0;overflow:auto}.ap-preview-dialog::backdrop{background:#000c}.ap-preview-dialog:not([open]){display:none}.ap-lightbox-bar{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:8px 20px;background:var(--color-bg,#0c0d0c);border-bottom:1px solid var(--color-border,#30322d);z-index:1;font-family:var(--font-mono,monospace);font-size:12px}.ap-lightbox-bar h4{font:inherit;margin:0}.ap-lightbox-image img{display:block;width:100%;height:auto;max-height:none;aspect-ratio:auto;object-fit:contain;transform:none!important}.ap-lightbox-link{display:inline-flex;align-items:center;min-height:48px;margin:8px 20px;color:var(--color-accent,#ff744f);font-size:13px;text-underline-offset:5px}.ap-section button:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:-4px}.ap-project-featured .ap-project-grid{grid-template-columns:minmax(0,1.1fr) minmax(0,1fr)}@media(max-width:639px){.ap-preview-bar{padding-inline:12px;font-size:9px}.ap-project-featured .ap-project-grid{grid-template-columns:minmax(0,1fr)}.ap-preview-dialog{width:calc(100vw - 16px);max-height:calc(100dvh - 16px)}.ap-lightbox-bar{padding-inline:14px}}\n";

const REEL_CSS = `
.ap-reel { display: grid; grid-template-columns: minmax(170px, .35fr) minmax(0, 1fr); align-items: stretch; margin-bottom: 50px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-surface); }
.ap-reel-index { display: grid; grid-auto-rows: minmax(70px, 1fr); align-self: start; }
.ap-reel-index button { display: grid; width: 100%; grid-template-columns: auto 1fr auto; align-items: center; gap: 13px; padding: 16px; border: 0; border-bottom: 1px solid var(--color-border); background: transparent; color: var(--color-text-muted); text-align: left; cursor: pointer; font: 500 clamp(13px, 1.75vw, 19px)/1.28 var(--font-sans); transition: color 160ms, background 160ms; }
.ap-reel-index button svg { width: 15px; height: 15px; opacity: .5; transition: transform 230ms, opacity 160ms; }
.ap-reel-index button[aria-pressed="true"] { background: var(--color-surface-2); color: var(--color-text); }
.ap-reel-index button[aria-pressed="true"] svg { color: var(--color-accent); opacity: 1; transform: translate(3px,-3px); }
.ap-reel-index button:focus-visible { outline-offset: -5px; }
.ap-reel-number { color: var(--color-accent); font: 10px var(--font-mono); }
.ap-reel-window { width: 100%; min-width: 0; aspect-ratio: 1.51; border-inline-start: 1px solid var(--color-border); }
.ap-reel-frame { min-height: 100%; animation: ap-film-cut 540ms cubic-bezier(.22,1,.36,1) both; }
.ap-reel-frame .ap-image-frame { margin: 0; border: 0; }
.ap-reel-frame .ap-preview-button img { aspect-ratio: 8 / 5; width: 100%; object-fit: cover; }
.ap-poster { min-height: 100%; aspect-ratio: 1.51; background: var(--color-bg); display: grid; grid-template-columns: 1fr; align-content: center; padding: clamp(22px, 5vw, 70px); }
.ap-poster:has(svg) { grid-template-columns: minmax(0, .75fr) minmax(0, 1fr); gap: 24px; align-items: center; }
.ap-poster svg { display: block; width: 100%; color: var(--color-accent); stroke: currentColor; stroke-width: 1.55; stroke-linecap: round; stroke-linejoin: round; }
.ap-leaf-guides { opacity: .36; stroke-dasharray: 4 5; }
.ap-poster-label { margin: 0 0 11px; color: var(--color-accent); font: 11px/1.5 var(--font-mono); }
.ap-poster-title { margin: 0; color: var(--color-text); font: 500 clamp(27px, 4.5vw, 62px)/1.06 var(--font-sans); letter-spacing: -.05em; }
.ap-poster-summary { margin: 12px 0 0; color: var(--color-text-muted); font: 13px/1.6 var(--font-sans); max-width: 42ch; }
@keyframes ap-film-cut {
  from { clip-path: inset(0 0 16% 9%); opacity: .57; }
  to { clip-path: inset(0); opacity: 1; }
}
@media (max-width: 740px) {
  .ap-reel { grid-template-columns: minmax(0, 1fr); margin-bottom: 30px; }
  .ap-reel-index { grid-auto-rows: minmax(44px, 1fr); }
  .ap-reel-index button { padding: 10px 13px; }
  .ap-reel-window { border-inline-start: 0; }
  .ap-poster:has(svg) { grid-template-columns: minmax(0, .48fr) minmax(0,1fr); gap: 14px; }
  .ap-poster { padding: 16px; }
}
@media (prefers-reduced-motion: reduce) { .ap-reel-frame { animation: none; } }
`;

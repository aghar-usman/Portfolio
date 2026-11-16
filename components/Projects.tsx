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

/** Server-renderable. Native disclosures work without a client animation library. */
export default function Projects({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="ap-section" aria-labelledby="ap-title">
      <div className="ap-wrap">
        <div className="ap-label"><span>03 /</span>Projects<i aria-hidden="true" /></div>
        <div className="ap-heading-row">
          <h2 id="ap-title">Selected projects<span>.</span></h2>
          <p>The interfaces, services<br className="ap-desktop-break" /> and systems I’ve built.</p>
        </div>

        <div className="ap-list">
          {projects.map((project, index) => (
            <article className={index === 0 ? "ap-project ap-project-featured" : "ap-project"} key={project.name + project.period + index} aria-labelledby={"ap-project-" + index}>
              <div className="ap-project-top"><span className="ap-number">{String(index + 1).padStart(2, "0")} /</span><span className="ap-period">{project.period}</span></div>
              <div className="ap-project-grid">
                <div className="ap-identity">
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
                  {project.points.length > 1 && <details className="ap-details">
                    <summary><span>Implementation details</span><span className="ap-disclosure-icon" aria-hidden="true" /></summary>
                    <ul className="ap-points">{project.points.slice(1).map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ul>
                  </details>}
                </div>
              </div>

              {project.screenshot && <div className="ap-image-frame">
                {/* Real supplied screenshot only; no generated project preview. */}
                {project.live ? <a href={project.live} target="_blank" rel="noopener noreferrer" aria-label={"Open " + project.name + " website (opens in a new tab)"}><img src={project.screenshot.src} alt={project.screenshot.alt} width={1440} height={900} loading="lazy" decoding="async" /></a> : <img src={project.screenshot.src} alt={project.screenshot.alt} width={1440} height={900} loading="lazy" decoding="async" />}
              </div>}
            </article>
          ))}
          {projects.length === 0 && <p className="ap-empty">No projects are listed yet.</p>}
        </div>
      </div>
      <style>{PROJECTS_CSS}</style>
    </section>
  );
}

const PROJECTS_CSS = "\n.ap-section{position:relative;box-sizing:border-box;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);padding-block:72px 40px;min-height:calc(100svh - var(--site-header-height,80px));scroll-margin-top:var(--site-header-height,80px)}.ap-section *{box-sizing:border-box}.ap-wrap{width:min(100% - 96px,1248px);margin-inline:auto}.ap-label{display:flex;align-items:center;gap:12px;font-family:var(--font-mono,monospace);font-size:12px;line-height:1.6;color:var(--color-text-muted,#a5a69d);margin-bottom:32px}.ap-label>span{color:var(--color-accent,#ff744f)}.ap-label i{display:block;width:64px;height:1px;margin-left:6px;background:var(--color-border,#30322d)}.ap-heading-row{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;padding-bottom:48px}.ap-heading-row h2{font-size:clamp(40px,4.4vw,62px);font-weight:500;letter-spacing:-.055em;line-height:1.08;margin:0;text-wrap:balance}.ap-heading-row h2>span{color:var(--color-accent,#ff744f)}.ap-heading-row>p{font-size:15px;line-height:1.75;color:var(--color-text-muted,#a5a69d);margin:0 0 4px;max-width:32ch}.ap-list{border-bottom:1px solid var(--color-border,#30322d)}.ap-project{padding-block:28px 44px;border-top:1px solid var(--color-border,#30322d)}.ap-project-top{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-bottom:28px;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.6}.ap-number{color:var(--color-accent,#ff744f)}.ap-period{color:var(--color-text-muted,#a5a69d)}.ap-project-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(40px,7vw,112px);align-items:start}.ap-identity,.ap-body{min-width:0}.ap-identity h3{font-size:36px;font-weight:500;letter-spacing:-.05em;line-height:1.12;overflow-wrap:anywhere;margin:0 0 16px}.ap-project-featured .ap-identity h3{font-size:clamp(40px,4vw,56px)}.ap-tagline{font-size:15px;line-height:1.75;color:var(--color-text-muted,#a5a69d);max-width:42ch;margin:0}.ap-actions{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:24px}.ap-link{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:18px;padding:10px 16px;border:1px solid var(--color-border,#30322d);border-radius:4px;color:var(--color-text,#f2f0e9);text-decoration:none;font-size:12px;font-weight:600;line-height:1.5;transition:background-color 150ms,border-color 150ms,color 150ms,transform 150ms}.ap-live{background:var(--color-accent,#ff744f);border-color:transparent;color:#17110d}.ap-link svg{flex:none;transition:transform 150ms}.ap-stack{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:24px 0 0}.ap-stack li{border:1px solid var(--color-border,#30322d);border-radius:4px;background:var(--color-surface,#151713);padding:6px 9px;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.6;color:var(--color-text-muted,#a5a69d);max-width:100%;overflow-wrap:anywhere}.ap-overview{font-size:18px;line-height:1.75;letter-spacing:-.015em;margin:0;text-wrap:pretty;color:var(--color-text,#f2f0e9)}.ap-details{margin-top:24px;border-top:1px solid var(--color-border,#30322d)}.ap-details summary{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:52px;list-style:none;cursor:pointer;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);transition:color 150ms}.ap-details summary::-webkit-details-marker{display:none}.ap-details summary::marker{content:\"\"}.ap-disclosure-icon{position:relative;width:12px;height:12px;flex:none;color:var(--color-accent,#ff744f)}.ap-disclosure-icon:before,.ap-disclosure-icon:after{content:\"\";position:absolute;background:currentColor}.ap-disclosure-icon:before{height:1px;width:12px;left:0;top:5px}.ap-disclosure-icon:after{height:12px;width:1px;top:0;left:5px;transform:scaleY(1);transition:transform 150ms}.ap-details[open] .ap-disclosure-icon:after{transform:scaleY(0)}.ap-details[open] summary{color:var(--color-text,#f2f0e9)}.ap-points{margin:4px 0 0;padding-left:17px;display:grid;gap:14px}.ap-points li{font-size:14px;line-height:1.8;color:var(--color-text-muted,#a5a69d);padding-left:6px;overflow-wrap:anywhere}.ap-points li::marker{color:var(--color-accent,#ff744f);font-size:10px}.ap-image-frame{margin-top:32px;overflow:hidden;border:1px solid var(--color-border,#30322d);border-radius:4px;background:var(--color-surface,#151713)}.ap-image-frame a{display:block;overflow:hidden}.ap-image-frame img{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:contain;object-position:top;transition:transform 600ms cubic-bezier(.2,.8,.2,1)}.ap-section a:focus-visible,.ap-details summary:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}.ap-image-frame a:focus-visible{outline-offset:-4px}.ap-empty{font-size:15px;line-height:1.7;color:var(--color-text-muted,#a5a69d);padding-bottom:32px;margin:0}\n@media(hover:hover) and (pointer:fine){.ap-link:hover{transform:translateY(-1px)}.ap-live:hover{background:var(--color-accent-hover,#ff8a6a)}.ap-source:hover{border-color:var(--color-text-muted,#a5a69d);background:var(--color-surface,#151713)}.ap-link:hover svg{transform:translateX(3px)}.ap-details summary:hover{color:var(--color-text,#f2f0e9)}.ap-image-frame a:hover img{transform:scale(1.02)}}.ap-link:active{transform:translateY(1px) scale(.985)}\n@media(max-width:1023px){.ap-wrap{width:calc(100% - 64px)}.ap-section{padding-top:56px}.ap-heading-row{gap:32px;padding-bottom:40px}.ap-heading-row h2{font-size:48px}.ap-heading-row>p{font-size:14px;max-width:26ch}.ap-desktop-break{display:none}.ap-project-grid{gap:40px}.ap-overview{font-size:17px}.ap-identity h3{font-size:32px}}\n@media(max-width:639px){.ap-wrap{width:calc(100% - 40px)}.ap-section{padding-block:40px 24px}.ap-label{margin-bottom:24px;font-size:11px}.ap-heading-row{flex-direction:column;align-items:flex-start;gap:20px;padding-bottom:32px}.ap-heading-row h2{font-size:42px}.ap-heading-row>p{font-size:14px;max-width:32ch}.ap-project{padding-block:24px 32px}.ap-project-top{margin-bottom:24px;font-size:10px}.ap-project-grid{grid-template-columns:minmax(0,1fr);gap:28px}.ap-identity h3{font-size:32px}.ap-project-featured .ap-identity h3{font-size:40px}.ap-tagline{font-size:14px}.ap-actions{gap:10px;margin-top:20px}.ap-link{min-height:48px;justify-content:space-between;flex:1 1 140px}.ap-stack{margin-top:20px}.ap-overview{font-size:16px;line-height:1.8}.ap-details{margin-top:20px}.ap-points li{font-size:14px}.ap-image-frame{margin-top:28px}}\n@media(prefers-reduced-motion:reduce){.ap-section *,.ap-section *:before,.ap-section *:after{transition:none!important}.ap-link:hover,.ap-link:active,.ap-link svg,.ap-image-frame img{transform:none!important}}\n";

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

interface ExperienceProps { experience: ExperienceEntry[] }

/** The content stays server-renderable; this section needs no animation library. */
export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="ae-section" aria-labelledby="ae-title">
      <div className="ae-wrap">
        <div className="ae-label"><span>02 /</span>Experience<i aria-hidden="true" /></div>
        <div className="ae-heading-row">
          <h2 id="ae-title">Experience<br /><span>in production.</span></h2>
          <p>The roles, the work,<br className="ae-desktop-break" /> and what I contributed.</p>
        </div>

        <div className="ae-entries">
          {experience.map((entry, index) => (
            <article className="ae-entry" key={entry.company + entry.period + index} aria-labelledby={"ae-company-" + index}>
              <div className="ae-meta">
                <div className="ae-period"><span className="ae-timeline-dot" aria-hidden="true" />{entry.period}</div>
                <h3 id={"ae-company-" + index}>{entry.company}</h3>
                <p className="ae-role">{entry.role}</p>
                <p className="ae-location">{entry.location}</p>
                <span className="ae-entry-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </div>

              {entry.points.length > 0 && <div className="ae-work">
                <p className="ae-work-label">Contributions</p>
                <ol className="ae-points">
                  {entry.points.map((point, pointIndex) => <li className={pointIndex === 0 ? "ae-point ae-point-lead" : "ae-point"} key={pointIndex}>
                    <span className="ae-point-index" aria-hidden="true">{String(pointIndex + 1).padStart(2, "0")}</span>
                    <p>{point}</p>
                  </li>)}
                </ol>
              </div>}
            </article>
          ))}
          {experience.length === 0 && <p className="ae-empty">See my projects for examples of my work.</p>}
        </div>
        <div className="ae-footer"><span>More of the work</span><a href="#projects">View projects<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></a></div>
      </div>
      <style>{EXPERIENCE_CSS}</style>
    </section>
  );
}

const EXPERIENCE_CSS = "\n.ae-section{box-sizing:border-box;position:relative;background:var(--color-surface,#151713);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);scroll-margin-top:var(--site-header-height,80px);min-height:calc(100svh - var(--site-header-height,80px));padding-block:72px 32px}.ae-section *{box-sizing:border-box}.ae-wrap{width:min(100% - 96px,1248px);margin-inline:auto}.ae-label{display:flex;align-items:center;gap:12px;font-family:var(--font-mono,monospace);font-size:12px;line-height:1.6;color:var(--color-text-muted,#a5a69d);margin-bottom:32px}.ae-label>span{color:var(--color-accent,#ff744f)}.ae-label i{display:block;width:64px;height:1px;margin-left:6px;background:var(--color-border,#30322d)}.ae-heading-row{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;padding-bottom:48px}.ae-heading-row h2{font-size:clamp(40px,4.4vw,62px);font-weight:500;letter-spacing:-.055em;line-height:1.08;margin:0;text-wrap:balance}.ae-heading-row h2>span{color:var(--color-text-muted,#a5a69d)}.ae-heading-row>p{font-size:15px;line-height:1.75;color:var(--color-text-muted,#a5a69d);margin:0 0 4px;max-width:32ch}.ae-entry{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);column-gap:64px;padding-block:36px 48px;border-top:1px solid var(--color-border,#30322d)}.ae-meta{position:relative;min-width:0;padding-left:22px;border-left:1px solid var(--color-border,#30322d)}.ae-period{position:relative;display:flex;align-items:center;font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);margin-bottom:22px}.ae-timeline-dot{position:absolute;left:-26px;top:6px;width:7px;height:7px;background:var(--color-accent,#ff744f);border-radius:50%;box-shadow:0 0 0 5px var(--color-surface,#151713)}.ae-meta h3{font-size:clamp(28px,3vw,40px);line-height:1.12;font-weight:500;letter-spacing:-.05em;overflow-wrap:anywhere;margin:0 0 14px}.ae-role{font-size:15px;line-height:1.6;color:var(--color-accent,#ff744f);margin:0 0 6px}.ae-location{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);margin:0}.ae-entry-number{display:block;margin-top:36px;font-family:var(--font-mono,monospace);font-size:12px;color:var(--color-text-muted,#a5a69d)}.ae-work{min-width:0}.ae-work-label{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);margin:0 0 22px}.ae-points{list-style:none;padding:0;margin:0}.ae-point{display:grid;grid-template-columns:22px minmax(0,1fr);gap:20px;padding-block:22px;border-top:1px solid var(--color-border,#30322d)}.ae-point:first-child{padding-top:0;border-top:0}.ae-point:last-child{padding-bottom:0}.ae-point-index{padding-top:5px;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-accent,#ff744f)}.ae-point p{margin:0;font-size:15px;line-height:1.8;color:var(--color-text-muted,#a5a69d);overflow-wrap:anywhere;text-wrap:pretty}.ae-point-lead p{font-size:18px;line-height:1.65;letter-spacing:-.015em;color:var(--color-text,#f2f0e9)}.ae-footer{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-top:18px;border-top:1px solid var(--color-border,#30322d)}.ae-footer>span{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d)}.ae-footer a{display:inline-flex;align-items:center;gap:16px;min-height:44px;color:var(--color-text,#f2f0e9);font-size:12px;text-decoration:underline;text-decoration-color:var(--color-border,#30322d);text-underline-offset:5px;transition:color 150ms,text-decoration-color 150ms}.ae-footer svg{transition:transform 150ms}.ae-footer a:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}.ae-empty{font-size:15px;line-height:1.7;color:var(--color-text-muted,#a5a69d);padding-bottom:32px;margin:0}\n@media(hover:hover) and (pointer:fine){.ae-footer a:hover{color:var(--color-accent,#ff744f);text-decoration-color:currentColor}.ae-footer a:hover svg{transform:translateX(3px)}}\n@media(max-width:1023px){.ae-wrap{width:calc(100% - 64px)}.ae-section{padding-top:56px}.ae-heading-row{gap:32px;padding-bottom:40px}.ae-heading-row h2{font-size:48px}.ae-heading-row>p{font-size:14px;max-width:26ch}.ae-desktop-break{display:none}.ae-entry{column-gap:32px;grid-template-columns:minmax(0,.85fr) minmax(0,1.5fr)}.ae-point{gap:14px}.ae-point-lead p{font-size:17px}}\n@media(max-width:639px){.ae-wrap{width:calc(100% - 40px)}.ae-section{padding-block:40px 24px}.ae-label{margin-bottom:24px;font-size:11px}.ae-heading-row{flex-direction:column;align-items:flex-start;gap:20px;padding-bottom:32px}.ae-heading-row h2{font-size:42px}.ae-heading-row>p{font-size:14px;max-width:32ch}.ae-entry{grid-template-columns:minmax(0,1fr);gap:32px;padding-block:28px 36px}.ae-meta{padding-left:20px}.ae-timeline-dot{left:-24px}.ae-period{margin-bottom:16px}.ae-meta h3{font-size:32px;margin-bottom:10px}.ae-entry-number{display:none}.ae-work-label{margin-bottom:20px}.ae-point{grid-template-columns:18px minmax(0,1fr);gap:12px;padding-block:20px}.ae-point p{font-size:14px;line-height:1.8}.ae-point-lead p{font-size:17px;line-height:1.7}.ae-footer{gap:16px}.ae-footer>span{font-size:10px}}\n@media(prefers-reduced-motion:reduce){.ae-footer a,.ae-footer svg{transition:none}.ae-footer a:hover svg{transform:none}}\n";

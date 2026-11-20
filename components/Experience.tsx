"use client";

import RequestDemo from "./RequestDemo";
import { stagger, useAnimate, useReducedMotion } from "motion/react";
import { portfolioCopy } from "@/data";

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  period: string;
  points: string[];
}

interface ExperienceProps { experience: ExperienceEntry[] }

export default function Experience({ experience }: ExperienceProps) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduced = useReducedMotion();

  return (
    <section ref={scope} id="experience" data-portfolio-chapter="" className="ae-section" aria-labelledby="ae-title">
      <div className="ae-wrap">
        <div className="ae-heading-row" data-portfolio-beat="experience-heading">
          <h2 id="ae-title">{portfolioCopy.experience.heading}<span aria-hidden="true">.</span></h2>
        </div>
        <div className="ae-entries">
          {experience.map((entry, index) => (
            <article className="ae-entry" key={entry.company + entry.period + index} aria-labelledby={"ae-company-" + index}>
              <div className="ae-meta">
                <h3 id={"ae-company-" + index}>{entry.company}</h3>
                <p className="ae-role">{entry.role}</p>
                <p className="ae-period">{entry.period}</p>
                <p className="ae-location">{entry.location}</p>
              </div>
              {entry.points.length > 0 && <div className="ae-work">
                <ul className="ae-points" role="list">
                  {entry.points.slice(0, 2).map((point, pointIndex) => <li className="ae-point" key={pointIndex}>{point}</li>)}
                </ul>
                {entry.points.length > 2 && <details className="ae-more section-disclosure" onToggle={(event) => {
                  if (!event.currentTarget.open || reduced || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                  animate(event.currentTarget.querySelectorAll(".ae-point"), { opacity: [.65, 1], y: [4, 0] }, { duration: .24, delay: stagger(.035), ease: [.22, 1, .36, 1] });
                }}>
                  <summary>
                    <span>{portfolioCopy.experience.more}</span>
                    <span className="section-plus" aria-hidden="true" />
                  </summary>
                  <ul className="ae-points" role="list">{entry.points.slice(2).map((point, index) => <li className="ae-point" key={index}>{point}</li>)}</ul>
                </details>}
              </div>}
            </article>
          ))}
          {experience.length === 0 && <p className="ae-empty">{portfolioCopy.experience.empty}</p>}
        </div>
        {experience.length > 0 && <RequestDemo />}
      </div>
      <style>{EXPERIENCE_CSS}</style>
    </section>
  );
}

const EXPERIENCE_CSS = `
  .ae-section { background: var(--color-surface); padding-block: var(--section-space); }
  .ae-entry { display: grid; grid-template-columns: minmax(118px, .4fr) minmax(0, 1fr); gap: 28px; border-top: 1px solid var(--color-border); padding-block: 22px 30px; }
  .ae-meta h3 { margin: 0 0 6px; font-size: clamp(23px, 3vw, 30px); font-weight: 550; letter-spacing: -.04em; line-height: 1.15; }
  .ae-role { margin: 0 0 12px; color: var(--color-accent); font-size: 14px; }
  .ae-period, .ae-location { margin: 0 0 3px; color: var(--color-text-muted); font: 11px/1.5 var(--font-mono); }
  .ae-work { min-width: 0; }
  .ae-points { display: grid; gap: 12px; list-style: none; margin: 0; padding: 0; }
  .ae-point { color: var(--color-text-muted); font-size: 15px; line-height: 1.65; text-wrap: pretty; }
  .ae-work > ul > li:first-child { color: var(--color-text); }
  .ae-more { margin-block-start: 6px; }
  .ae-more .ae-points { margin-block: 4px 8px; }
  .ae-empty { color: var(--color-text-muted); }
  @media (max-width: 640px) {
    .ae-entry { grid-template-columns: minmax(0,1fr); gap: 16px; padding-block: 18px 24px; }
  }
`;

"use client";

import { useMemo } from "react";
import { SiReact, SiPython, SiPostgresql, SiDocker, SiTypescript, SiTensorflow } from "react-icons/si";
import { stagger, useAnimate, useReducedMotion } from "motion/react";
import { portfolioCopy, skillGroups, type SkillGroup } from "@/data";

export { skillGroups, type SkillGroup } from "@/data";

interface SkillsProps {
  skills?: SkillGroup[];
  disableAnimations?: boolean;
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

const toolMarks = [
  { name: "React", Icon: SiReact, color: "#61dafb" },
  { name: "TensorFlow", Icon: SiTensorflow, color: "#ff6f00" },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#699eca" },
  { name: "Docker", Icon: SiDocker, color: "#2496ed" },
  { name: "Python", Icon: SiPython, color: "#ffd343" },
  { name: "TypeScript", Icon: SiTypescript, color: "#5da9f6" },
];

export default function Skills({ skills = skillGroups, disableAnimations = false }: SkillsProps) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduced = useReducedMotion();
  const groups = useMemo(() => skills.map((group) => ({
    ...group,
    items: Array.from(new Set(group.items.map((item) => item.trim()).filter(Boolean))),
  })).filter((group) => group.items.length), [skills]);

  return (
    <section ref={scope} id="skills" data-portfolio-chapter="" className="cs-section" data-motion={disableAnimations ? "off" : undefined} aria-labelledby="cs-title">
      <div className="cs-wrap">
        <div className="cs-heading" data-portfolio-beat="stack-heading">
          <h2 id="cs-title">{portfolioCopy.skills.heading}<span aria-hidden="true">.</span></h2>
        </div>
        <div className="cs-grid">{groups.map((group, index) => {
          const mark = toolMarks.find(({ name }) => group.items.includes(name));
          const shownTools = group.items.length <= 6 ? group.items : group.items.slice(0, 5);
          const moreTools = group.items.slice(shownTools.length);
          return (
            <article className="cs-group" data-stack-skill={group.layer} key={group.label + index}>
              <div className="cs-group-heading">
                <h3>{group.label}</h3>
                {mark && <mark.Icon size={20} color={mark.color} aria-hidden="true" />}
              </div>
              <ul className="cs-tools" role="list" aria-label={group.label}>{shownTools.map((item) => <li key={item}>{item}</li>)}</ul>
              {moreTools.length > 0 && <details className="cs-more section-disclosure" onToggle={(event) => {
                if (!event.currentTarget.open || disableAnimations || reduced || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
                animate(event.currentTarget.querySelectorAll(".cs-extra li"), { opacity: [.65, 1], y: [4, 0] }, { duration: .22, delay: stagger(.025), ease: [.22, 1, .36, 1] });
              }}>
                <summary aria-label={`${portfolioCopy.skills.more} for ${group.label} (${moreTools.length})`}>
                  <span>{portfolioCopy.skills.more} ({moreTools.length})</span>
                  <span className="section-plus" aria-hidden="true" />
                </summary>
                <ul className="cs-tools cs-extra" role="list" aria-label={"Additional " + group.label + " tools"}>{moreTools.map((item) => <li key={item}>{item}</li>)}</ul>
              </details>}
            </article>
          );
        })}</div>
        {!groups.length && <p className="cs-empty">My projects show the tools I work with.</p>}
      </div>
      <style>{SKILLS_CSS}</style>
    </section>
  );
}

const SKILLS_CSS = `
  .cs-section { padding-block: var(--section-space); background: var(--color-bg); }
  .cs-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 32px; align-items: start; }
  .cs-group { border-top: 1px solid var(--color-border); padding: 22px 0 18px; min-width: 0; }
  .cs-group-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 12px; }
  .cs-group h3 { margin: 0; font-size: 17px; font-weight: 550; line-height: 1.35; letter-spacing: -.025em; }
  .cs-tools { display: flex; list-style: none; margin: 0; padding: 0; flex-wrap: wrap; gap: 5px 13px; }
  .cs-tools li { color: var(--color-text-muted); font-size: 14px; line-height: 1.55; overflow-wrap: anywhere; }
  .cs-more { margin-block-start: 4px; }
  .cs-extra { padding: 3px 0 10px; }
  .cs-empty { color: var(--color-text-muted); }
  @media (max-width: 640px) {
    .cs-grid { grid-template-columns: minmax(0, 1fr); }
    .cs-group { padding-block: 16px 14px; }
  }
`;

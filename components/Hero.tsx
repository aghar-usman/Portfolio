interface HeroProps {
  profile: {
    name: string;
    roles: string[];
    summary: string | string[];
    location?: string;
    headline?: string;
    intro?: string;
  };
  contact: { resume: string; github: string; linkedin: string };
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero({ profile, contact }: HeroProps) {
  const role = profile.roles.join(" / ") || "Full-stack developer";
  const heading = profile.headline?.trim() || role;
  const intro = profile.intro ?? [profile.summary].flat().join(" ");

  return (
    <section id="about" className="ph-hero" data-portfolio-chapter="" aria-labelledby="ph-title">
      <div className="ph-wrap">
          <div className="ph-copy">
            <div className="ph-identity">
              <p className="ph-name">{profile.name}</p>
              <p className="ph-role">{[role, profile.location].filter(Boolean).join(" · ")}</p>
            </div>
            <h1 id="ph-title">{heading}</h1>
            <p className="ph-intro">{intro}</p>
            <div className="ph-actions">
              <a className="ph-primary" href="#projects">View projects <Arrow /></a>
              {contact.resume && <a className="ph-secondary" href={contact.resume} target="_blank" rel="noopener noreferrer">View résumé <span aria-hidden="true">↗</span></a>}
            </div>
          </div>

      </div>
      <style>{heroStyles}</style>
    </section>
  );
}

const heroStyles = `
  .ph-hero { position: relative; overflow: clip; background: var(--color-bg); color: var(--color-text); }
  .ph-wrap { position: relative; display: grid; align-content: center; min-height: calc(100svh - var(--site-header-height)); padding-block: 44px 60px; }
  .ph-copy { position: relative; z-index: 1; min-width: 0; }
  .ph-identity { display: grid; gap: 5px; margin-block-end: clamp(24px, 3.3vw, 48px); }
  .ph-name { margin: 0; font-size: 15px; font-weight: 550; line-height: 1.35; }
  .ph-role { margin: 0; color: var(--color-text-muted); font: 12px/1.55 var(--font-mono); }
  .ph-copy h1 { position: relative; margin: 0 0 27px; font-size: clamp(48px, 7.2vw, 108px); line-height: .98; letter-spacing: -.065em; font-weight: 500; overflow-wrap: anywhere; white-space: pre-line; color: var(--color-text-muted); }
  .ph-copy h1::first-line { color: var(--color-text); }
  .ph-intro { color: var(--color-text-muted); max-width: 44ch; font-size: 17px; line-height: 1.65; margin: 0; text-wrap: pretty; }
  .ph-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .ph-actions a { display: inline-flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 50px; padding: 12px 19px; border: 1px solid var(--color-border); border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; transition: background-color 160ms, border-color 160ms; }
  .ph-actions .ph-primary { background: var(--color-accent); color: #17110d; border-color: transparent; }
  .ph-secondary { color: var(--color-text); }
  .ph-primary:hover { background: var(--color-accent-hover); }
  .ph-secondary:hover { border-color: var(--color-text-muted); }
  @media (hover: hover) and (pointer: fine) {
    .ph-actions svg { transition: transform 150ms ease-out; }
    .ph-primary:hover svg { transform: translateX(3px); }
  }
  @media (max-width: 840px) {
    .ph-copy h1 { font-size: clamp(42px, 9.6vw, 72px); }
  }
  @media (max-width: 639px) {
    .ph-wrap { padding-block: 34px 54px; }
    .ph-role { font-size: 11px; }
    .ph-copy h1 { margin-bottom: 18px; }
    .ph-intro { font-size: 15px; }
    .ph-actions { margin-top: 21px; gap: 8px; }
    .ph-actions a { min-height: 46px; gap: 12px; padding-inline: 12px; }
  }
`;

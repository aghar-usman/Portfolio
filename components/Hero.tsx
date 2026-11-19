"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={down ? "M12 4v16m-6-6 6 6 6-6" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero({ profile, contact }: HeroProps) {
  const root = useRef<HTMLElement>(null);
  const fill = useId();
  const heading = (profile.headline ?? "From the first click\nto the database.").trim().split(/\n+|(?<=\.)\s+/);
  const intro = profile.intro ?? "I’ve built an architecture studio’s website, Flask APIs, and an assistant that turns plain-English questions into SQL.";

  useEffect(() => {
    if (!root.current) return;
    const scene = root.current;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = gsap.utils.selector(scene);
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo(elements(".ph-light"), { opacity: .25, scale: .86 }, { opacity: 1, scale: 1, duration: 2.8 }, 0)
        .fromTo(elements(".ph-data"), { x: 23, y: -94, opacity: .45 }, { x: 0, y: 0, opacity: 1, duration: 1.34 }, .18)
        .fromTo(elements(".ph-api"), { x: 11, y: -42, opacity: .58 }, { x: 0, y: 0, opacity: 1, duration: 1.46 }, .4)
        .fromTo(elements(".ph-interface"), { x: -30, y: 66 }, { x: 0, y: 0, duration: 1.7 }, .62)
        .fromTo(elements(".ph-connector"), { strokeDashoffset: 1, opacity: .15 }, { strokeDashoffset: 0, opacity: .75, duration: 1.16, stagger: .15, ease: "power2.inOut" }, 1.18)
        .fromTo(elements(".ph-trace"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.24, stagger: .18, ease: "power2.inOut" }, 1.27)
        .fromTo(elements(".ph-label"), { x: -12, opacity: .35 }, { x: 0, opacity: 1, duration: .6, stagger: .15 }, 1.65);
    });
    media.add("(min-width: 960px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)", () => {
      const figure = scene.querySelector<HTMLElement>(".ph-figure");
      const sticky = scene.querySelector<HTMLElement>(".ph-sticky");
      if (!figure || !sticky) return;
      const header = document.querySelector(".an-header");
      const wrap = figure.offsetParent;
      const camera = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scene,
          start: () => "top top+=" + (header?.getBoundingClientRect().height ?? 0),
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      camera
        .to(scene.querySelector(".ph-copy"), {
          y: -165, autoAlpha: 0, duration: .42, ease: "power1.in",
        }, .11)
        .to(scene.querySelector(".ph-bottom"), { autoAlpha: 0, y: -20, duration: .28 }, .03)
        .to(figure, {
          x: () => scene.getBoundingClientRect().width / 2 - (figure.offsetLeft + (wrap?.getBoundingClientRect().left ?? 0) + figure.offsetWidth / 2),
          y: -38, scale: 1.51, duration: .58, ease: "power2.inOut",
        }, .04)
        .to(figure, {
          y: () => -sticky.offsetHeight * .46, scale: 1.65, autoAlpha: .24, duration: .38, ease: "power2.in",
        }, .62);
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={root} id="about" className="ph-hero" data-portfolio-chapter="" aria-labelledby="ph-title">
      <span data-portfolio-dock="hero" aria-hidden="true" />
      <div className="ph-sticky">
      <div className="ph-light" aria-hidden="true" />
      <div className="ph-wrap">
        <div className="ph-stage">
          <div className="ph-copy">
            <p className="ph-identity"><span>{profile.name}</span><span>{profile.roles.join(" / ") || "Full-stack developer"}</span></p>
            <h1 id="ph-title">{heading.map((line, index) => (
              <span key={index}>{line}</span>
            ))}</h1>
            <p className="ph-intro">{intro}</p>
            <div className="ph-actions">
              <a className="ph-primary" href="#projects">View projects <Arrow /></a>
              {contact.resume && <a className="ph-secondary" href={contact.resume} target="_blank" rel="noopener noreferrer">View résumé <span aria-hidden="true">↗</span></a>}
            </div>
          </div>

          <figure className="ph-figure">
            <svg className="ph-machine" viewBox="0 0 690 600" role="img" aria-label="Exploded view of a web application: interface, API, and data">
              <defs>
                <linearGradient id={fill} x2="1" y2="1">
                  <stop stopColor="var(--color-surface-2)" />
                  <stop offset="1" stopColor="var(--color-bg)" />
                </linearGradient>
              </defs>

              <g className="ph-grid" transform="matrix(1 .26 -.85 .37 210 338)">
                <path d="M-24-24H430V229H-24ZM-24 27H430M-24 77H430M-24 127H430M-24 177H430M27-24V229M77-24V229M127-24V229M177-24V229M227-24V229M277-24V229M327-24V229M377-24V229" />
              </g>

              <g className="ph-data">
                <g transform="matrix(1 .26 -.85 .37 210 298)">
                  <rect className="ph-depth" width="390" height="200" rx="12" y="9" />
                  <rect className="ph-plane" width="390" height="200" rx="12" fill={`url(#${fill})`} />
                  <path className="ph-layout" d="M22 48H368M22 83H368M22 119H368M22 154H368M105 27V174M168 27V174M256 27V174" />
                  <path className="ph-fine" d="M39 64h44m39 0h23m45 0h44m41 0h75M39 101h34m48 0h29m40 0h30m55 0h67M39 137h47m34 0h23m47 0h48m36 0h54" />
                  <path className="ph-trace" pathLength="1" d="M105 48H256V154H368" />
                </g>
                <path className="ph-lead" d="M599 401l23 7h24" />
                <text className="ph-label" x="606" y="431">DATA</text>
              </g>

              <g className="ph-api">
                <g transform="matrix(1 .26 -.85 .37 210 199)">
                  <rect className="ph-depth" width="390" height="200" rx="12" y="9" />
                  <rect className="ph-plane" width="390" height="200" rx="12" fill={`url(#${fill})`} />
                  <path className="ph-layout" d="M25 100H82L123 55H198L234 145H313L347 101H366M25 51h52m-52 99h56m222-99h61m-76 99h78" />
                  <path className="ph-trace" pathLength="1" d="M25 100H82L123 55H198L234 145H313L347 101H366" />
                  <circle className="ph-node" cx="82" cy="100" r="7" />
                  <circle className="ph-node" cx="198" cy="55" r="7" />
                  <circle className="ph-node" cx="313" cy="145" r="7" />
                </g>
                <path className="ph-lead" d="M599 302l23 7h24" />
                <text className="ph-label" x="606" y="332">API</text>
              </g>

              <g className="ph-interface">
                <g transform="matrix(1 .26 -.85 .37 210 100)">
                  <rect className="ph-depth" width="390" height="200" rx="12" y="9" />
                  <rect className="ph-plane ph-front" width="390" height="200" rx="12" fill={`url(#${fill})`} />
                  <path className="ph-layout" d="M1 35H388M25 61H183M25 80H139M25 152H226M25 169H188M294 131H363M294 148H344M294 165H333" />
                  <path className="ph-fine" d="M171 18H243M305 18H364" />
                  <circle className="ph-node" cx="26" cy="18" r="3" />
                  <circle className="ph-node" cx="39" cy="18" r="3" />
                  <circle className="ph-node" cx="52" cy="18" r="3" />
                  <rect className="ph-layout ph-window" x="25" y="103" width="94" height="24" rx="3" />
                  <rect className="ph-layout" x="211" y="58" width="153" height="59" rx="4" />
                  <path className="ph-trace" pathLength="1" d="m224 101 31-23 25 12 26-22 43 17M25 103h94" />
                </g>
                <path className="ph-lead" d="M599 203l23 7h24" />
                <text className="ph-label" x="606" y="233">UI</text>
              </g>

              <path className="ph-connector" pathLength="1" d="M210 100V298" />
              <path className="ph-connector" pathLength="1" d="M600 202V400" />
              <path className="ph-connector" pathLength="1" d="M41 174V372" />
              <path className="ph-layout" d="M78 464h42m-21-21v42M572 496h42m-21-21v42" />
            </svg>
          </figure>
        </div>

        <div className="ph-bottom">
          {profile.location && <span>{profile.location}</span>}
          <a href="#skills">View tech stack <Arrow down /></a>
        </div>
      </div>
      </div>
      <style>{heroStyles}</style>
    </section>
  );
}

const heroStyles = `
  .ph-hero { position: relative; overflow: clip; background: var(--color-bg); color: var(--color-text); }
  .ph-wrap { position: relative; width: min(100% - 96px, 1248px); margin-inline: auto; display: grid; align-content: center; min-height: calc(100svh - var(--site-header-height, 80px)); padding-block: 40px 14px; }
  .ph-stage { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr); align-items: center; }
  .ph-copy { position: relative; z-index: 1; min-width: 0; }
  .ph-light { position: absolute; inset: 0; pointer-events: none; transform-origin: 76% 50%; background: radial-gradient(ellipse at 78% 53%, color-mix(in srgb, var(--color-accent) 11%, transparent), transparent 49%); }
  .ph-identity { display: flex; flex-wrap: wrap; gap: 8px 14px; align-items: center; font: 11px/1.7 var(--font-mono); margin: 0 0 30px; }
  .ph-identity span + span { color: var(--color-text-muted); }
  .ph-identity span + span::before { content: ""; display: inline-block; width: 4px; height: 4px; border-radius: 50%; margin-inline-end: 12px; vertical-align: .18em; background: var(--color-accent); }
  .ph-copy h1 { position: relative; width: min(117%, calc(100vw - 96px)); margin: 0 0 27px; font-size: clamp(44px, 5.55vw, 80px); line-height: 1.03; letter-spacing: -.066em; font-weight: 500; overflow-wrap: anywhere; }
  .ph-copy h1 span { display: block; }
  .ph-copy h1 span + span { color: var(--color-text-muted); }
  .ph-intro { color: var(--color-text-muted); max-width: 44ch; font-size: 16px; line-height: 1.75; margin: 0; text-wrap: pretty; }
  .ph-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
  .ph-actions a { display: inline-flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 50px; padding: 12px 19px; border: 1px solid var(--color-border); border-radius: 4px; text-decoration: none; font-size: 13px; font-weight: 600; transition: background-color 160ms, border-color 160ms; }
  .ph-actions .ph-primary { background: var(--color-accent); color: #17110d; border-color: transparent; }
  .ph-secondary { color: var(--color-text); }
  .ph-primary:hover { background: var(--color-accent-hover); }
  .ph-secondary:hover { border-color: var(--color-text-muted); }
  .ph-figure { position: relative; margin: 0 -38px 0 -13px; min-width: 0; }
  .ph-machine { display: block; overflow: visible; width: 100%; height: auto; fill: none; transform-origin: 54% 50%; }
  .ph-grid { stroke: var(--color-border); stroke-width: 1; opacity: .82; }
  .ph-plane { stroke: var(--color-text-muted); stroke-opacity: .57; stroke-width: 1.55; }
  .ph-front { stroke: var(--color-accent); stroke-opacity: .84; }
  .ph-depth { fill: var(--color-surface); stroke: var(--color-border); stroke-width: 2; }
  .ph-layout, .ph-fine { stroke: var(--color-text-muted); stroke-opacity: .42; stroke-width: 1.45; }
  .ph-fine { stroke-width: 2; stroke-opacity: .55; }
  .ph-window { fill: color-mix(in srgb, var(--color-accent) 20%, var(--color-surface)); }
  .ph-node { fill: var(--color-accent); stroke: var(--color-bg); stroke-width: 1.5; }
  .ph-trace, .ph-connector { stroke: var(--color-accent); stroke-dasharray: 1; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
  .ph-connector { stroke-width: .85; opacity: .6; }
  .ph-lead { stroke: var(--color-accent); stroke-width: 1; stroke-opacity: .75; }
  .ph-label { fill: var(--color-text); font: 12px var(--font-mono); letter-spacing: .1em; }
  .ph-bottom { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-top: 1px solid var(--color-border); padding-top: 12px; margin-top: 12px; color: var(--color-text-muted); font: 11px/1.6 var(--font-mono); }
  .ph-bottom a { margin-inline-start: auto; display: inline-flex; min-height: 44px; gap: 12px; align-items: center; color: inherit; text-decoration: none; }
  .ph-bottom a:hover { color: var(--color-text); }
  @media (min-width: 960px) and (min-height: 680px) and (prefers-reduced-motion: no-preference) {
    .ph-hero { height: 170svh; }
    .ph-sticky { position: sticky; top: var(--site-header-height, 80px); }
    .ph-figure { will-change: transform; }
  }
  @media (max-width: 1023px) { .ph-wrap { width: calc(100% - 64px); } .ph-figure { margin-inline-end: -22px; } }
  @media (max-width: 840px) {
    .ph-stage { grid-template-columns: 1fr; }
    .ph-copy h1 { width: 100%; font-size: clamp(42px, 9.5vw, 68px); }
    .ph-figure { width: min(100%, 570px); justify-self: center; margin: 12px 0 -8px; }
    .ph-light { background: radial-gradient(ellipse at 54% 67%, color-mix(in srgb, var(--color-accent) 11%, transparent), transparent 52%); }
  }
  @media (max-width: 639px) {
    .ph-wrap { width: calc(100% - 40px); padding-top: 35px; }
    .ph-identity { margin-bottom: 22px; font-size: 10px; }
    .ph-copy h1 { margin-bottom: 18px; }
    .ph-intro { font-size: 14px; }
    .ph-actions { margin-top: 21px; gap: 8px; }
    .ph-actions a { min-height: 46px; gap: 12px; padding-inline: 12px; }
    .ph-label { font-size: 17px; }
    .ph-bottom { margin-top: 0; font-size: 10px; }
  }
`;

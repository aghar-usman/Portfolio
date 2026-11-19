"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Three perspective cuts from the hero's exploded stack, spaced for each chapter.
const frames = [
  [[4, 12, 26, 3, 59, 13, 37, 22], [4, 24, 26, 15, 59, 25, 37, 34], [4, 36, 26, 27, 59, 37, 37, 46]],
  [[5, 10, 26, 3, 59, 11, 39, 19], [5, 23, 26, 16, 59, 24, 39, 32], [5, 36, 26, 29, 59, 37, 39, 45]],
  [[3, 18, 18, 18, 28, 25, 43, 25], [3, 25, 23, 25, 40, 25, 60, 25], [3, 33, 18, 33, 28, 25, 48, 25]],
  [[24, 8, 7, 8, 7, 23, 7, 29], [40, 43, 57, 43, 57, 28, 57, 21], [24, 38, 32, 32, 37, 24, 44, 16]],
  [[8, 30, 26, 18, 41, 18, 58, 30], [8, 38, 26, 26, 41, 26, 58, 38], [18, 21, 26, 13, 41, 13, 48, 21]],
  [[7, 18, 26, 10, 60, 19, 40, 27], [7, 25, 26, 17, 60, 26, 40, 34], [7, 32, 26, 24, 60, 33, 40, 41]],
];

const ENTERED = "portfolio-motion-entered";

export function SectionWindow({ chapter }: { chapter: "stack" | "experience" }) {
  const isStack = chapter === "stack";
  return (
    <div className={"portfolio-window portfolio-window-" + chapter}>
      <div className="portfolio-window-label">{isStack ? "01 / Stack" : "02 / Experience"}</div>
      <p className="portfolio-window-title">{isStack ? "Tools I build with" : "Experience"}<span>.</span></p>
      {isStack ? (
        <div className="portfolio-window-tools">
          {[
            ["Frontend", "React", "Next.js"],
            ["Backend & APIs", "Python", "Flask"],
            ["Databases & data", "PostgreSQL", "SQL"],
          ].map(([group, first, second]) => (
            <div key={group}><small>{group}</small><strong>{first}</strong><span>{second}</span></div>
          ))}
        </div>
      ) : (
        <div className="portfolio-window-flow">
          <p>Which orders are pending?</p>
          <svg viewBox="0 0 640 30" fill="none" aria-hidden="true">
            <path d="M10 15h620" />
            <circle cx="10" cy="15" r="5" /><circle cx="320" cy="15" r="5" /><circle cx="630" cy="15" r="5" />
          </svg>
          <div><span>Request</span><span>Service</span><span>Data</span></div>
        </div>
      )}
    </div>
  );
}

export default function PortfolioMotion() {
  const signal = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const graphic = signal.current;
    if (!graphic) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const chapterElements = Array.from(document.querySelectorAll<HTMLElement>("[data-portfolio-chapter]"));
      const docks = chapterElements.map((chapter) => chapter.querySelector<HTMLElement>("[data-portfolio-dock]"));
      const strokes = Array.from(graphic.querySelectorAll("polyline"));
      let viewport = { height: 0, width: 0, header: 0 };
      let positions: { x: number; y: number; frame: number }[] = [];
      let raf = 0;
      let lastProgress = -1;

      const setX = gsap.quickSetter(graphic, "x", "px");
      const setY = gsap.quickSetter(graphic, "y", "px");
      const setRotation = gsap.quickSetter(graphic, "rotation", "deg");
      const setScale = gsap.quickSetter(graphic, "scale");
      const setOpacity = gsap.quickSetter(graphic, "opacity");

      const draw = () => {
        raf = 0;
        if (positions.length < 2) return;

        const scroll = window.scrollY;
        const wide = viewport.width >= 960;
        const lower = Math.max(viewport.header + 46, viewport.height * .68);
        const probe = scroll + lower;
        let index = 0;
        while (index < positions.length - 2 && positions[index + 1].y < probe) index += 1;

        const start = positions[index];
        const end = positions[index + 1];
        const span = Math.max(1, end.y - start.y);
        // Hold the outgoing silhouette until scrolling approaches the next chapter.
        const handoffDistance = Math.min(span, viewport.height * .56);
        const travel = gsap.utils.clamp(0, 1, (probe - (end.y - handoffDistance)) / handoffDistance);
        const ease = travel * travel * (3 - 2 * travel);
        const bend = Math.sin(Math.PI * travel);
        const worldY = gsap.utils.clamp(positions[0].y, positions[positions.length - 1].y, probe);
        const visibility = gsap.utils.clamp(0, 1, (scroll - positions[0].y + viewport.height * .64) / 130);
        const y = worldY - scroll - bend * 66;
        const headerClearance = gsap.utils.clamp(0, 1, (y - viewport.header - 20) / 50);

        const anchorX = gsap.utils.interpolate(start.x, end.x, ease);
        const edgeX = (viewport.width + anchorX + 24) / 2;
        setX(wide ? gsap.utils.interpolate(anchorX, edgeX, Math.sin(Math.PI * travel)) - bend * 14 : anchorX - bend * 8);
        setY(y);
        setScale(1 + bend * (wide ? .4 : .12));
        setRotation(bend * (index % 2 === 0 ? -20 : 20));
        setOpacity(visibility * headerClearance);

        const progress = index + ease;
        if (progress === lastProgress) return;
        lastProgress = progress;
        strokes.forEach((stroke, strokeIndex) => {
          const from = frames[start.frame][strokeIndex];
          const to = frames[end.frame][strokeIndex];
          stroke.setAttribute("points", from.map((value, coordinate) => (
            gsap.utils.interpolate(value, to[coordinate], ease).toFixed(1)
          )).join(" "));
        });
      };

      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(draw);
      };

      const measure = () => {
        viewport = {
          height: window.innerHeight,
          width: document.documentElement.clientWidth,
          header: document.querySelector(".an-header")?.getBoundingClientRect().height ?? 80,
        };
        positions = docks.flatMap((dock, frame) => {
          if (!dock) return [];
          const rect = dock.getBoundingClientRect();
          return [{ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 + window.scrollY, frame }];
        });
        lastProgress = -1;
        schedule();
      };

      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const element = entry.target;
          element.classList.add(ENTERED);
          observer.unobserve(element);
        }
      }, { rootMargin: "0px 0px -16% 0px" });

      const beats = Array.from(document.querySelectorAll<HTMLElement>("[data-portfolio-beat]"))
        .filter((element) => !element.closest('[data-motion="off"]'));
      for (const beat of beats) observer.observe(beat);

      const resize = new ResizeObserver(measure);
      for (const chapter of chapterElements) resize.observe(chapter);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", measure);
      measure();

      return () => {
        observer.disconnect();
        resize.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", measure);
        if (raf) cancelAnimationFrame(raf);
        for (const beat of beats) beat.classList.remove(ENTERED);
        graphic.removeAttribute("style");
      };
    });
    media.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 741px)" }, ({ conditions }) => {
      if (!conditions?.motion) return;
      const bridge = document.querySelector<HTMLElement>("[data-portfolio-layer-bridge]");
      if (!bridge) return;
      const elements = gsap.utils.selector(bridge);
      const assembly = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: bridge,
          start: "top 88%",
          end: "bottom 47%",
          scrub: true,
        },
      });
      assembly
        .fromTo(elements(".cs-bridge-api"), { x: -23, y: 70, opacity: .55 }, { x: 0, y: -6, opacity: 1, duration: .74, ease: "power2.out" }, 0)
        .fromTo(elements(".cs-bridge-data"), { x: 34, y: -36, opacity: .45 }, { x: 0, y: 18, opacity: 1, duration: .8, ease: "power2.out" }, .08)
        .fromTo(elements(".cs-layer-rails"), { opacity: 0 }, { opacity: .38, duration: .48 }, .26)
        .fromTo(elements(".cs-bridge-route"), { strokeDashoffset: 1, opacity: .15 }, { strokeDashoffset: 0, opacity: .8, duration: .53, ease: "power2.inOut" }, .44);
      if (conditions.wide) {
        const preview = elements(".cs-nested");
        assembly
          .fromTo(preview, { scale: .17, rotation: -5, y: 18, autoAlpha: 0 }, { scale: .28, rotation: -2, y: 10, autoAlpha: 1, duration: .14, ease: "power2.out" }, .39)
          .to(preview, { scale: 1.04, rotation: 0, y: -14, duration: .29, ease: "power2.inOut" }, .53)
          .to(elements(".cs-layer-assembly"), { scale: 1.17, opacity: .04, duration: .29, ease: "power1.in" }, .59)
          .to(preview, { autoAlpha: 0, y: -44, duration: .23, ease: "power2.in" }, .85);
      }
    });
    return () => media.revert();
  }, []);

  return (
    <>
      <svg ref={signal} className="portfolio-signal" viewBox="0 0 64 50" fill="none" aria-hidden="true">
        {frames[0].map((stroke, index) => <polyline key={index} points={stroke.join(" ")} />)}
      </svg>
      <style>{motionStyles}</style>
    </>
  );
}

const motionStyles = `
  .portfolio-window {
    box-sizing: border-box;
    height: 100%;
    min-height: 246px;
    text-align: left;
    overflow: clip;
    padding: clamp(24px, 4.5vw, 62px);
    background: var(--color-bg);
    border: 1px solid color-mix(in srgb, var(--color-accent) 66%, var(--color-border));
    box-shadow: 0 20px 65px color-mix(in srgb, var(--color-bg) 83%, transparent);
    color: var(--color-text);
  }
  .portfolio-window-experience { background: var(--color-surface); }
  .portfolio-window-label { color: var(--color-accent); font: 11px/1.5 var(--font-mono); }
  .portfolio-window-title { margin: 23px 0 clamp(18px, 3vw, 33px); font: 500 clamp(39px, 4.4vw, 62px)/1.04 var(--font-sans); letter-spacing: -.055em; }
  .portfolio-window-title > span { color: var(--color-accent); }
  .portfolio-window-tools { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 16px; }
  .portfolio-window-tools > div { display: grid; gap: 9px; align-content: start; min-height: 128px; border: 1px solid var(--color-border); padding: 20px 16px; border-radius: 6px; background: var(--color-surface); }
  .portfolio-window-tools small { color: var(--color-text-muted); font: 11px/1.4 var(--font-mono); }
  .portfolio-window-tools strong, .portfolio-window-tools span { color: var(--color-text); font: 500 clamp(15px, 2vw, 27px)/1.1 var(--font-sans); letter-spacing: -.025em; }
  .portfolio-window-tools span { color: var(--color-text-muted); }
  .portfolio-window-flow { padding: 15px 22px 12px; border: 1px solid var(--color-border); border-radius: 6px; background: var(--color-bg); }
  .portfolio-window-flow > p { margin: 0 0 9px; color: var(--color-text); font-size: clamp(15px, 2vw, 25px); }
  .portfolio-window-flow svg { display: block; width: 100%; height: 25px; stroke: var(--color-accent); stroke-width: 1.5; overflow: visible; }
  .portfolio-window-flow svg circle { fill: var(--color-bg); }
  .portfolio-window-flow > div { display: flex; justify-content: space-between; color: var(--color-text-muted); font: 10px/1.5 var(--font-mono); }
  .portfolio-signal {
    position: fixed;
    top: 0;
    left: 0;
    width: clamp(30px, 5vw, 62px);
    height: auto;
    translate: -50% -50%;
    z-index: 4;
    opacity: 0;
    pointer-events: none;
    color: var(--color-accent);
  }
  .portfolio-signal polyline {
    stroke: currentColor;
    stroke-width: 1.65;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  .portfolio-signal polyline:first-child { opacity: .7; }
  .portfolio-signal polyline:last-child { opacity: .48; }
  [data-portfolio-dock] {
    display: block;
    width: clamp(30px, 5vw, 62px);
    height: 30px;
    flex: none;
    margin-inline-start: auto;
    pointer-events: none;
  }
  [data-portfolio-dock="hero"] {
    position: absolute;
    inset-inline-end: max(21px, calc((100% - 1248px) / 2));
    bottom: 9%;
  }
  [data-portfolio-beat="chapter"] { position: relative; }
  [data-portfolio-beat="chapter"]::after {
    content: "";
    position: absolute;
    height: 1px;
    width: min(18vw, 190px);
    inset-inline-end: clamp(38px, 6vw, 76px);
    top: 50%;
    background: linear-gradient(90deg, transparent, var(--color-accent));
    opacity: 0;
    transform: scaleX(0);
    transform-origin: right;
    pointer-events: none;
  }
  [data-portfolio-beat="chapter"].portfolio-motion-entered::after {
    animation: portfolio-dock 1.15s cubic-bezier(.22, 1, .36, 1) both;
  }

  [data-portfolio-beat="stack"] { position: relative; }
  [data-portfolio-beat="stack"].portfolio-motion-entered::after {
    content: "";
    position: absolute;
    inset-inline: 7px;
    top: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
    transform-origin: left center;
    pointer-events: none;
    animation: portfolio-fit .95s cubic-bezier(.45, 0, .25, 1) var(--portfolio-beat-delay, 0s) both;
  }
  [data-portfolio-beat="stack"].portfolio-motion-entered .cs-brand {
    animation: portfolio-assemble .7s cubic-bezier(.2, .75, .2, 1) both;
  }
  [data-portfolio-beat="stack"].portfolio-motion-entered .cs-group-heading > span:first-child {
    animation: portfolio-index .72s ease-out both;
  }
  [data-portfolio-beat="project"].portfolio-motion-entered h3 {
    animation: portfolio-project-title .7s cubic-bezier(.22, 1, .36, 1) both;
  }
  [data-portfolio-beat="education"].portfolio-motion-entered .ax-result-mark {
    animation: portfolio-node .85s cubic-bezier(.22, 1, .36, 1) both;
  }
  [data-portfolio-beat="education"].portfolio-motion-entered .ax-languages dl > div {
    animation: portfolio-register .65s cubic-bezier(.22, 1, .36, 1) both;
  }
  .portfolio-motion-entered .ax-languages dl > div:nth-child(2) { animation-delay: .08s; }
  .portfolio-motion-entered .ax-languages dl > div:nth-child(3) { animation-delay: .16s; }
  .portfolio-motion-entered .ax-languages dl > div:nth-child(4) { animation-delay: .24s; }
  [data-portfolio-beat="contact"].portfolio-motion-entered .af-primary > svg {
    animation: portfolio-send .9s cubic-bezier(.22, 1, .36, 1) both;
  }

  @keyframes portfolio-dock {
    0% { transform: scaleX(0); opacity: 0; }
    40% { opacity: .8; }
    100% { transform: scaleX(1); opacity: .32; }
  }

  @keyframes portfolio-fit {
    0% { transform: scaleX(.06); opacity: 0; }
    42% { opacity: .86; }
    100% { transform: scaleX(1); opacity: 0; }
  }
  @keyframes portfolio-project-title { from { translate: 0 13px; } to { translate: 0 0; } }
  @keyframes portfolio-assemble {
    from { translate: -12px 6px; rotate: -30deg; scale: .75; opacity: .5; }
    to { translate: 0 0; rotate: 0deg; scale: 1; opacity: 1; }
  }
  @keyframes portfolio-index {
    35% { color: var(--color-accent); }
  }
  @keyframes portfolio-node {
    35% { scale: 2.2; }
    to { scale: 1; }
  }
  @keyframes portfolio-register {
    from { translate: 10px 0; }
    to { translate: 0 0; }
  }
  @keyframes portfolio-send { 45% { translate: 5px -5px; } }
  [data-portfolio-beat="stack"]:nth-child(3n+2) { --portfolio-beat-delay: .1s; }
  [data-portfolio-beat="stack"]:nth-child(3n) { --portfolio-beat-delay: .2s; }
  [data-portfolio-beat="stack"].portfolio-motion-entered .cs-brand,
  [data-portfolio-beat="stack"].portfolio-motion-entered .cs-group-heading > span:first-child {
    animation-delay: var(--portfolio-beat-delay, 0s);
  }
  @media (max-width: 639px) {
    .portfolio-signal { width: 26px; }
    [data-portfolio-beat="chapter"]::after { width: min(14vw, 90px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .portfolio-signal { display: none; }
  }
`;

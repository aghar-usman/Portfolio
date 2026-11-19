"use client";

import { useEffect, useRef } from "react";

const SOURCE = "/film/portfolio-scroll.mp4";
const FRAME = 1 / 24;

const chapters = [
  { id: "about", time: 0 },
  { id: "skills", time: 4.25 },
  { id: "experience", time: 10 },
  { id: "projects", time: 14.75 },
  { id: "education", time: 20 },
  { id: "contact", time: 24.25 },
];

interface Stop {
  y: number;
  time: number;
}

export default function PortfolioFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const root = document.documentElement;
    const media = window.matchMedia("(min-width: 960px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)");
    let dispose = () => {};

    function connect() {
      dispose();
      if (!media.matches || !video) return;

      const sectionNodes = chapters.flatMap((chapter) => {
        const element = document.getElementById(chapter.id);
        return element ? [{ element, ...chapter }] : [];
      });
      if (sectionNodes.length !== chapters.length) return;
      const header = document.querySelector(".an-header");
      let stops: Stop[] = [];
      let frameId = 0;
      let published = false;

      function draw() {
        frameId = 0;
        if (!video || video.seeking || video.readyState < 1 || stops.length < 2) return;

        const y = Math.max(0, window.scrollY);
        let index = 0;
        while (index < stops.length - 2 && y > stops[index + 1].y) index += 1;
        const from = stops[index];
        const to = stops[index + 1];
        const ratio = Math.min(1, Math.max(0, (y - from.y) / Math.max(1, to.y - from.y)));
        const latestFrame = video.duration - FRAME;
        const time = Math.min(latestFrame, Math.round((from.time + (to.time - from.time) * ratio) / FRAME) * FRAME);
        if (!Number.isFinite(time) || time < 0) return;

        const openingProgress = Math.min(1, y / Math.max(1, stops[1].y));
        root.style.setProperty("--portfolio-film-shade", String(.87 - openingProgress * .58));

        if (Math.abs(video.currentTime - time) > FRAME / 2) {
          video.currentTime = time;
        } else if (!published && video.readyState >= 2) {
          root.dataset.portfolioFilm = "ready";
          published = true;
        }
      }

      function schedule() {
        if (!frameId) frameId = requestAnimationFrame(draw);
      }

      function measure() {
        if (!video) return;
        const top = header?.getBoundingClientRect().height ?? 80;
        const maxScroll = Math.max(1, root.scrollHeight - window.innerHeight);
        const scroll = window.scrollY;
        stops = sectionNodes.map(({ element, id, time }, index) => {
          const start = element.getBoundingClientRect().top + scroll - top;
          const cap = id === "contact" ? maxScroll - Math.min(120, maxScroll * .03) : maxScroll;
          return { y: index === 0 ? 0 : Math.min(cap, Math.max(0, start)), time };
        });
        stops.push({ y: maxScroll, time: video.duration - FRAME });
        schedule();
      }

      function useFallback() {
        delete root.dataset.portfolioFilm;
        published = false;
      }

      const resize = new ResizeObserver(measure);
      for (const { element } of sectionNodes) resize.observe(element);
      if (header) resize.observe(header);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", measure);
      video.addEventListener("loadedmetadata", measure);
      video.addEventListener("loadeddata", schedule);
      video.addEventListener("seeked", schedule);
      video.addEventListener("error", useFallback);

      video.preload = "auto";
      video.src = SOURCE;
      measure();

      dispose = () => {
        resize.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", measure);
        video.removeEventListener("loadedmetadata", measure);
        video.removeEventListener("loadeddata", schedule);
        video.removeEventListener("seeked", schedule);
        video.removeEventListener("error", useFallback);
        if (frameId) cancelAnimationFrame(frameId);
        useFallback();
        root.style.removeProperty("--portfolio-film-shade");
        video.removeAttribute("src");
        video.load();
      };
    }

    connect();
    media.addEventListener("change", connect);
    return () => {
      media.removeEventListener("change", connect);
      dispose();
    };
  }, []);

  return (
    <>
      <div className="portfolio-film" aria-hidden="true">
        <div className="portfolio-film-frame"><video ref={videoRef} muted playsInline preload="none" /></div>
        <div className="portfolio-film-scrim" />
      </div>
      <style>{filmStyles}</style>
    </>
  );
}

const filmStyles = `
  .portfolio-film {
    display: none;
    position: fixed;
    inset: var(--site-header-height, 80px) 0 0;
    z-index: 0;
    overflow: clip;
    pointer-events: none;
    background: var(--color-bg);
  }
  .portfolio-film-frame {
    position: absolute;
    width: max(100%, calc((100svh - var(--site-header-height, 80px)) * 16 / 9));
    aspect-ratio: 16 / 9;
    left: 50%;
    top: 50%;
    translate: -50% -50%;
  }
  .portfolio-film-frame video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .portfolio-film-frame::after {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 17% 24% at 90.6% 83.4%, var(--color-bg) 0 33%, transparent 100%);
  }
  .portfolio-film-scrim {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, var(--color-bg) 0%, transparent 70%),
      linear-gradient(0deg, color-mix(in srgb, var(--color-bg) 68%, transparent), transparent 24%);
    opacity: var(--portfolio-film-shade, .87);
  }
  @media (min-width: 960px) and (min-height: 650px) and (prefers-reduced-motion: no-preference) {
    html[data-portfolio-film="ready"] .portfolio-film { display: block; }
    html[data-portfolio-film="ready"] .ph-hero { background: transparent; }
    html[data-portfolio-film="ready"] :is(.ph-light, .ph-figure, .ph-nested, .cs-opening-frame, .cs-layer-assembly, .cs-nested, .ae-layer-arrival) { visibility: hidden !important; }
    html[data-portfolio-film="ready"] :is(.cs-section, .ae-section, .ap-section, .ax-section, .af-footer) {
      background: linear-gradient(105deg,
        color-mix(in srgb, var(--film-section-color, var(--color-bg)) 88%, transparent),
        color-mix(in srgb, var(--film-section-color, var(--color-bg)) 63%, transparent));
    }
    html[data-portfolio-film="ready"] :is(.ae-section, .ax-section) { --film-section-color: var(--color-surface); }
    html[data-portfolio-film="ready"] .cs-layer-bridge { background: transparent; }
    .portfolio-film-gap { height: clamp(105px, 24svh, 245px); }
    html[data-portfolio-film="ready"] .portfolio-film-gap {
      position: relative;
      background: linear-gradient(0deg, color-mix(in srgb, var(--color-bg) 64%, transparent), transparent 42%, transparent 68%, color-mix(in srgb, var(--color-bg) 56%, transparent));
    }
  }
`;

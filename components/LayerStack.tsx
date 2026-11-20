"use client";

import { useEffect, useId, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { guideCharacter, layerStory, projects, requestDemo, type StackLayer } from "@/data";
import Guide from "./Guide";

const surfaces: Record<StackLayer, { offset: number; traces: string }> = {
  ui: { offset: 0, traces: "M112 130l128-43 108 44-125 46zM142 131l99-33 35 14-98 34zM222 149l45-16m-32 26 45-16m-33 26 45-16" },
  api: { offset: 48, traces: "M108 139l43-15 53 22 62-22 43 17m-109-35 36 15 22-8 44 18m-125 23 21 9 63-22" },
  data: { offset: 96, traces: "M120 132l105-36 117 47-106 36zM143 125l116 47m-94-55 116 47m-94-55 116 47m-94-55 116 47m-177-13 105-37m-79 47 105-37m-78 47 105-37" },
};

const plate = "M47 131 235 66l181 72-189 72Z";
type Pose = keyof typeof layerStory.poses;

interface Cue {
  at: number;
  pose: Pose;
  active?: StackLayer;
  project?: number;
}

export default function LayerStack() {
  const id = useId();
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const story = stage?.closest(".stack-story");
    if (!stage || !story) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({ motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1100px)" }, ({ conditions }) => {
      if (!conditions?.motion) return;
      const desktop = conditions.desktop;
      const layers = layerStory.layers.map(({ id }) => {
        const surface = stage.querySelector<SVGGElement>(`[data-layer="${id}"]`)!;
        return { id, surface, glint: surface.querySelector(".layer-glint")! };
      });
      const prints = Array.from(stage.querySelectorAll(".layer-print"));
      const packet = stage.querySelector<SVGGElement>(".layer-packet")!;
      const packetTrack = stage.querySelector<SVGGElement>(".layer-packet-track")!;
      const response = stage.querySelector<SVGGElement>(".layer-response")!;
      const guideHome = stage.querySelector<HTMLElement>(".guide-home")!;
      const svg = stage.querySelector<SVGSVGElement>(".layer-svg")!;
      const clickPacket = stage.querySelector<SVGGElement>(".layer-click-packet")!;
      let clickFlight: gsap.core.Tween | undefined;
      function launch() {
        clickFlight?.kill();
        clickFlight = gsap.fromTo(clickPacket, { y: 0, opacity: 1 }, { y: 146, opacity: 0, duration: .68, ease: "power2.inOut" });
      }
      window.addEventListener(guideCharacter.packetEvent, launch);
      const movePacket = gsap.quickSetter(packet, "y", "px");
      const showPacket = gsap.quickSetter(packet, "opacity");
      const syncPacket = (event: Event) => {
        const progress = (event as CustomEvent<number>).detail;
        const travel = (desktop ? 143 : 115) * progress;
        movePacket(travel);
        showPacket(Math.min(1, progress * 12, (1 - progress) * 12));
      };
      window.addEventListener(requestDemo.event, syncPacket);
      const skills = Array.from(story.querySelectorAll<HTMLElement>("[data-stack-skill]"));
      const cards = Array.from(story.querySelectorAll<HTMLElement>("[data-stack-project]"));
      const content = story.querySelector(".stack-content");
      let timeline: gsap.core.Timeline | undefined;
      let measureTimer = 0;
      let lastSection = "";
      let measuring = false;
      let dimensions = "";

      function measure() {
        const currentDimensions = `${innerWidth}:${innerHeight}:${story!.clientHeight}:${content?.clientHeight}:${svg.clientWidth}`;
        if (currentDimensions === dimensions) return;
        dimensions = currentDimensions;
        measuring = true;
        timeline?.scrollTrigger?.kill(false, true);
        timeline?.revert();
        const limit = Math.max(1, ScrollTrigger.maxScroll(window));
        const unit = 100 / limit;
        const viewLead = Math.min(innerHeight * .42, 320);
        const cueTime = (node: Element) => gsap.utils.clamp(0, 100,
          (node.getBoundingClientRect().top + scrollY - viewLead) * unit);
        const steps = layerStory.steps;
        const section = (id: string) => story!.querySelector(`#${id}`)!;
        const stackAt = cueTime(section(steps.skills.id));
        const easingTime = Math.min(3.8, innerHeight * .26 * unit);
        const detailScale = desktop ? 1 : .4;
        const svgScale = svg.clientWidth / 460;
        const cues: Cue[] = [
          { at: stackAt, pose: "exploded" },
          ...skills.map((skill): Cue => ({ at: cueTime(skill), pose: "exploded", active: skill.dataset.stackSkill as StackLayer })),
          { at: cueTime(section(steps.experience.id)), pose: "request", active: steps.experience.layer },
          { at: cueTime(section(steps.projects.id)), pose: "showcase", active: steps.projects.layer, project: 0 },
          ...cards.map((card, project): Cue => ({ at: cueTime(card), pose: "showcase", active: steps.projects.layer, project })),
          { at: cueTime(section(steps.education.id)), pose: "assembled" },
          { at: Math.min(cueTime(section(steps.contact.id)), 100 - easingTime), pose: "response" },
        ];
        if (!desktop) cues.splice(1, skills.length);
        const markers = Object.values(steps).map(({ id }) => ({ id, at: id === steps.contact.id ? Math.min(cueTime(section(id)), 100 - easingTime) : cueTime(section(id)) }));

        timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut", overwrite: false } });
        timeline.to({}, { duration: 100 }, 0);
        timeline.set(prints, { opacity: 0, scaleX: .12, transformOrigin: "left center" }, 0);

        cues.sort((first, second) => first.at - second.at).forEach((cue, index) => {
          const duration = Math.max(.05, Math.min(easingTime, (cues[index + 1]?.at ?? 100) - cue.at));
          for (const { id, surface, glint } of layers) {
            const [x, y] = layerStory.poses[cue.pose][id];
            const transformScale = cue.pose === "response" ? 1 : detailScale;
            timeline!.to(surface, { x: x * transformScale, y: y * transformScale, opacity: !cue.active || cue.active === id ? 1 : .43, duration }, cue.at);
            timeline!.to(glint, { opacity: cue.active === id ? 1 : .25, duration }, cue.at);
            if (cue.pose === "response") timeline!.to(surface, { opacity: 0, duration: duration * .38 }, cue.at + duration * .62);
          }
          prints.forEach((print, printIndex) => {
            const active = printIndex === cue.project;
            timeline!.to(print, { opacity: active ? 1 : 0, scaleX: active ? 1 : .12, duration }, cue.at);
          });
          timeline!.to(packetTrack, { opacity: cue.pose === "request" ? 1 : 0, duration }, cue.at);
          if (desktop) timeline!.to(guideHome, { y: layerStory.poses[cue.pose].ui[1] * svgScale, duration }, cue.at);
          if (cue.pose === "response") {
            timeline!.fromTo(response, { opacity: 0, y: 9, scale: .97 }, { opacity: 1, y: 0, scale: 1, transformOrigin: "center", duration: duration * .42, immediateRender: false }, cue.at + duration * .58);
          }
        });

        const idle = (progress: number) => stage!.toggleAttribute("data-idle", progress * 100 < stackAt - easingTime);
        function sync(progress: number) {
          idle(progress);
          const current = markers.findLast(marker => marker.at <= progress * 100)?.id ?? steps.about.id;
          if (current === lastSection) return;
          lastSection = current;
          stage!.dataset.section = current;
          window.dispatchEvent(new CustomEvent(guideCharacter.sectionEvent, { detail: current }));
        }
        const trigger = ScrollTrigger.create({
          animation: timeline, start: 0, end: "max", scrub: true,
          onUpdate: ({ progress }) => { if (!measuring) sync(progress); },
        });
        trigger.update();
        measuring = false;
        sync(trigger.progress);
      }

      const observer = new ResizeObserver(() => {
        window.clearTimeout(measureTimer);
        measureTimer = window.setTimeout(measure, 160);
      });
      if (content) observer.observe(content);
      observer.observe(story);
      observer.observe(stage);
      measure();

      return () => {
        observer.disconnect();
        window.clearTimeout(measureTimer);
        window.removeEventListener(requestDemo.event, syncPacket);
        window.removeEventListener(guideCharacter.packetEvent, launch);
        clickFlight?.kill();
        clickPacket.removeAttribute("style");
        clickPacket.removeAttribute("transform");
        packet.removeAttribute("style");
        packet.removeAttribute("transform");
        timeline?.scrollTrigger?.kill(false, true);
        timeline?.revert();
        stage.removeAttribute("data-idle");
        stage.removeAttribute("data-section");
      };
    });
    return () => media.revert();
  }, []);

  return (
    <div ref={stageRef} className="layer-stage">
      <div className="layer-stage-field">
        <svg className="layer-svg" viewBox="0 0 460 378" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={id + "-glass"} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="var(--color-text-muted)" stopOpacity=".14" />
              <stop offset=".56" stopColor="var(--color-surface-2)" stopOpacity=".72" />
              <stop offset="1" stopColor="var(--color-bg)" stopOpacity=".78" />
            </linearGradient>
            <radialGradient id={id + "-shadow"}>
              <stop stopColor="#000" stopOpacity=".78" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="236" cy="324" rx="196" ry="34" fill={`url(#${id}-shadow)`} />
          <path className="layer-guide" d="M27 131v181M430 137v177M227 211v114M235 67v78M16 311h22m381 2h22M216 325h22" />
          <g className="layer-float">
            {[...layerStory.layers].reverse().map(({ id: layer, label }) => (
              <g key={layer} transform={`translate(0 ${surfaces[layer].offset})`}>
                <g data-layer-entry><g data-layer={layer}>
                  <path className="layer-edge" d="m47 131 180 79 189-72v9l-189 72-180-79Z" />
                  <path className="layer-plate" d={plate} fill={`url(#${id}-glass)`} />
                  <path className="layer-etching" d={surfaces[layer].traces} />
                  <path className="layer-glint" d={plate} />
                  {layer === "ui" && (
                    <g transform="matrix(1 -.34 .89 .37 119 127)">
                      {projects.map((project, index) => (
                        <g className="layer-print" key={project.name} transform="translate(1 1)">
                          <rect width="156" height="80" rx="4" />
                          <path d="M0 12h156M7 6h4m5 0h4m5 0h4" />
                          <path d={index === 0 ? "M13 67l28-29 14 11 14-14 17 18 18-15 37 29" : index === 1 ? "M17 52h55m-55 7h41m37-10h41v17H95z" : "M45 64c10-22 22-25 42-23-5 17-16 25-30 24m-14 5 24-16"} />
                          <text x="12" y="30">{project.name}</text>
                        </g>
                      ))}
                    </g>
                  )}
                  <path className="layer-leader" d="m323 173 36 15h39" />
                  <text className="layer-type" x="400" y="192">{label}</text>
                </g></g>
              </g>
            ))}
          </g>
          <g transform="translate(236 115)">
            <g className="layer-click-packet">
              <circle r="13" className="layer-packet-halo" />
              <circle r="5" className="layer-packet-core" />
            </g>
          </g>
          <g className="layer-packet-track">
            <g transform="translate(236 115)">
              <g className="layer-packet">
                <circle r="13" className="layer-packet-halo" />
                <circle r="5" className="layer-packet-core" />
              </g>
            </g>
          </g>
          <g className="layer-response">
            <rect className="layer-response-card" x="72" y="116" width="316" height="149" rx="5" />
            <path className="layer-response-rule" d="M72 143h316m-289-14h13m7 0h5" />
            <circle className="layer-packet-core" cx="109" cy="200" r="4" />
            <text className="layer-response-type" x="126" y="209">{layerStory.steps.contact.status}</text>
          </g>
        </svg>
      </div>
      <Guide />
    </div>
  );
}

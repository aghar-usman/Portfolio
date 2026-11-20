"use client";

import { useEffect, useRef, useState } from "react";
import { guideCharacter, requestDemo, stompIntro, type StorySection } from "@/data";
import { createGuideMotion } from "./guideMotion";
import { createGuideScenes } from "./guideScenes";
import { playStompIntro } from "./stompMotion";

const faces = ["smirk", "neutral", "happy", "angry", "surprised"] as const;
type Face = (typeof faces)[number];

export default function Guide() {
  const home = useRef<HTMLDivElement>(null);
  const lane = useRef<HTMLDivElement>(null);
  const mover = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const activate = useRef<() => void>(() => {});
  const [face, setFace] = useState<Face>("smirk");
  const [bubble, setBubble] = useState("");
  const [introFinished, setIntroFinished] = useState(false);
  const [sceneCut, setSceneCut] = useState(false);

  useEffect(() => {
    if (!home.current || !lane.current || !mover.current || !scene.current) return;
    const stage = home.current.closest<HTMLElement>(".layer-stage")!;
    const story = stage.closest(".stack-story")!;
    const dock = lane.current;
    const actor = mover.current;
    const scenicLayer = scene.current;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const motion = createGuideMotion(home.current, actor);
    const scenes = createGuideScenes(story, actor);
    const button = actor.querySelector("button")!;
    let intro: ReturnType<typeof playStompIntro> | undefined;
    let section: StorySection = "about";
    let hovering = false;
    let clicked: number[] = [];
    let previousScroll = scrollY;
    let responseTimer = 0;
    let idleTimer = 0;
    let pointerTimer = 0;
    let scrollTimer = 0;
    let recentScroll = false;
    let visible = false;
    let reacting = false;
    let idleCount = 0;

    const busy = () => Boolean(intro?.active || document.documentElement.hasAttribute("data-stomp-pending"));
    const setHome = () => { actor.style.setProperty("--guide-home-x", `${motion.xFor(guideCharacter.anchors[section])}px`); };
    function goIdle() {
      reacting = false;
      setFace(hovering ? "happy" : "smirk");
      setBubble("");
      if (!reduced.matches && !motion.moving()) motion.turn("front");
    }
    function react(next: Face, text = "") {
      interruptIdle();
      window.clearTimeout(responseTimer);
      reacting = true;
      setFace(next);
      setBubble(text);
      responseTimer = window.setTimeout(goIdle, text ? 1500 : 780);
    }

    activate.current = () => {
      if (busy()) return;
      const now = performance.now();
      clicked = clicked.filter(time => now - time < 2000);
      clicked.push(now);
      const overwhelmed = clicked.length >= 3;
      if (overwhelmed) clicked = [];
      react(overwhelmed ? "angry" : "surprised", overwhelmed ? guideCharacter.manyClicks : undefined);
      window.dispatchEvent(new CustomEvent(guideCharacter.navigationEvent, { detail: button }));
      if (reduced.matches) return;
      motion.turn("front");
      motion.hop();
      window.dispatchEvent(new Event(guideCharacter.packetEvent));
    };

    function changeSection(event: Event) {
      const next = (event as CustomEvent<StorySection>).detail;
      if (next === section || !Object.hasOwn(guideCharacter.anchors, next)) return;
      scenes.stop();
      section = next;
      idleCount = 0;
      interruptIdle();
      if (busy() || reduced.matches) return;
      const x = motion.xFor(guideCharacter.anchors[section]);
      if (next === "contact") motion.peek(x);
      else motion.walk(x, next === "education");
      scenes.play(next);
    }
    function direction() {
      const current = scrollY;
      const delta = current - previousScroll;
      previousScroll = current;
      if (busy() || reduced.matches || Math.abs(delta) < 2) return;
      motion.warmWalkArt();
      interruptIdle();
      if (!motion.moving()) motion.turn(delta > 0 ? "back" : "front");
      recentScroll = true;
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        recentScroll = false;
        if (!motion.moving()) motion.turn("front");
      }, 175);
    }
    function pointer(event: PointerEvent) {
      if (busy() || reduced.matches || !fine.matches || event.pointerType !== "mouse" || recentScroll || motion.moving() || motion.idling()) return;
      const { left, width } = actor.getBoundingClientRect();
      motion.look((event.clientX - left - width / 2) / 90);
      window.clearTimeout(pointerTimer);
      pointerTimer = window.setTimeout(() => motion.look(0), 240);
    }
    function hover(event: PointerEvent) {
      if (busy() || reduced.matches || !fine.matches || event.pointerType !== "mouse") return;
      hovering = event.type === "pointerenter";
      if (!hovering) {
        if (!bubble && !clicked.length) setFace("smirk");
        return;
      }
      motion.turn("front");
      react("happy");
      motion.lean(4, -6);
    }
    function tool(event: Event) {
      if (busy() || reduced.matches || !fine.matches || !(event instanceof PointerEvent) || event.pointerType !== "mouse" || !(event.target instanceof Element)) return;
      const item = event.target.closest<HTMLElement>("[data-stack-skill]");
      if (!item || (event.relatedTarget instanceof Node && item.contains(event.relatedTarget))) return;
      interruptIdle();
      if (event.type === "pointerover") {
        stage.dataset.guideHighlight = item.dataset.stackSkill;
        motion.turn("left");
        motion.lean(-4);
      } else {
        delete stage.dataset.guideHighlight;
        if (!recentScroll && !motion.moving()) motion.turn("front");
      }
    }
    function blocked() {
      if (busy()) return;
      if (!reduced.matches) motion.turn("front");
      react("angry", guideCharacter.blocked);
    }
    function followPacket(event: Event) {
      if (busy() || reduced.matches || section !== "experience" || (event as CustomEvent<number>).detail !== 0) return;
      interruptIdle();
      motion.lean(3, -2);
    }
    const projectIndex = story.querySelector(".ap-reel-index");
    const selectionObserver = new MutationObserver(() => {
      if (section === "projects" && !busy() && !reduced.matches && !motion.moving()) {
        interruptIdle();
        motion.lean(-3);
      }
    });
    if (projectIndex) selectionObserver.observe(projectIndex, { subtree: true, attributes: true, attributeFilter: ["aria-pressed"] });
    const idleTiming = guideCharacter.idle;
    function idleLater(delay: number = idleTiming.first) {
      window.clearTimeout(idleTimer);
      if (reduced.matches || !visible || document.hidden) return;
      motion.warmIdleArt(section, idleCount);
      idleTimer = window.setTimeout(() => {
        const available = !busy() && !hovering && !recentScroll && !reacting && !motion.moving()
          && !stage.dataset.guideHighlight && button.getAttribute("aria-expanded") !== "true"
          && getComputedStyle(button).visibility === "visible" && !document.querySelector("dialog[open]");
        if (available) {
          motion.turn("front");
          motion.idleVariety(section, idleCount++);
        }
        idleLater(available ? idleTiming.repeat : idleTiming.gap);
      }, delay);
    }
    function interruptIdle() {
      if (motion.idling()) motion.stopIdle();
      idleLater();
    }
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= .4;
      interruptIdle();
    }, { threshold: .4 });
    visibility.observe(button);
    document.addEventListener("visibilitychange", interruptIdle);
    function preferMotion() {
      if (reduced.matches) {
        intro?.finish();
        scenes.stop();
        motion.destroy();
        actor.style.removeProperty("--guide-home-x");
        setFace("neutral");
        setBubble("");
      }
      idleLater();
    }
    const resize = new ResizeObserver(() => { if (!busy() && !reduced.matches) setHome(); });
    resize.observe(home.current);
    reduced.addEventListener("change", preferMotion);
    window.addEventListener("scroll", direction, { passive: true });
    window.addEventListener("pointermove", pointer, { passive: true });
    window.addEventListener(guideCharacter.sectionEvent, changeSection);
    window.addEventListener(requestDemo.blockedEvent, blocked);
    window.addEventListener(requestDemo.event, followPacket);
    story.addEventListener("pointerover", tool);
    story.addEventListener("pointerout", tool);
    button.addEventListener("pointerenter", hover);
    button.addEventListener("pointerleave", hover);

    const root = document.documentElement;
    let mounted = true;
    function startIntro() {
      if (!mounted || intro || (reduced.matches && !root.hasAttribute("data-stomp-debug")) || !root.hasAttribute("data-stomp-ready")) return;
      motion.warmWalkArt();
      intro = playStompIntro({ stage, lane: dock, mover: actor, home: home.current!, scene: scenicLayer, motion, cut: () => setSceneCut(true), complete: () => { setIntroFinished(true); setHome(); goIdle(); idleLater(); } });
    }
    const dismissed = () => { setIntroFinished(true); setHome(); };
    window.addEventListener(stompIntro.readyEvent, startIntro);
    window.addEventListener(stompIntro.endedEvent, dismissed);
    if (root.hasAttribute("data-stomp-ready")) queueMicrotask(startIntro);
    else if (!root.hasAttribute("data-stomp-pending")) dismissed();
    idleLater();

    return () => {
      mounted = false;
      intro?.destroy();
      scenes.stop();
      selectionObserver.disconnect();
      window.removeEventListener(stompIntro.readyEvent, startIntro);
      window.removeEventListener(stompIntro.endedEvent, dismissed);
      for (const timer of [responseTimer, idleTimer, pointerTimer, scrollTimer]) window.clearTimeout(timer);
      resize.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", interruptIdle);
      motion.destroy();
      delete stage.dataset.guideHighlight;
      reduced.removeEventListener("change", preferMotion);
      window.removeEventListener("scroll", direction);
      window.removeEventListener("pointermove", pointer);
      window.removeEventListener(guideCharacter.sectionEvent, changeSection);
      window.removeEventListener(requestDemo.blockedEvent, blocked);
      window.removeEventListener(requestDemo.event, followPacket);
      story.removeEventListener("pointerover", tool);
      story.removeEventListener("pointerout", tool);
      button.removeEventListener("pointerenter", hover);
      button.removeEventListener("pointerleave", hover);
      activate.current = () => {};
    };
    // The event callbacks keep transient motion inside this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="guide-home" ref={home}>
      {!introFinished && !sceneCut && <>
        <div className="stomp-scene" ref={scene} aria-hidden="true">
          <div className="stomp-dark" />
          <div className="stomp-switch"><i /><b /><em /></div>
          <div className="stomp-impact"><i className="stomp-ring" /><i className="stomp-tick" /><span>&gt; click</span>{Array.from({ length: 6 }, (_, i) => <b key={i} />)}</div>
        </div>
      </>}
      <div className="guide-lane" ref={lane}>
        {!introFinished && <div className="stomp-landing-rings" aria-hidden="true"><i /><i /><i /></div>}
        <div className="guide-mover" ref={mover}>
          <div className="stomp-spotlight" aria-hidden="true" />
          <div className="stomp-shadow" aria-hidden="true" />
          {!introFinished && <div className="stomp-actor-fx" aria-hidden="true"><i className="stomp-note">♪</i><i className="stomp-question">?</i>{Array.from({ length: 6 }, (_, i) => <b key={i} />)}</div>}
          {!introFinished && <div className="stomp-ghost" aria-hidden="true"><img src="/character/pose-pockets-body.webp" alt="" /><img src="/character/angry.webp" alt="" /></div>}
          <button className="guide-button" type="button" aria-label={guideCharacter.label} aria-controls="page-guide-panel" aria-expanded={false} onClick={() => activate.current()}>
            <span data-guide-step><span data-guide-jump><span data-guide-tilt><span data-guide-cursor><span data-guide-acting>
              <span data-guide-flip data-pose="front" data-main-pose={stompIntro.mainPose} aria-hidden="true">
                <img data-guide-art="front" src="/character/front.webp" width={124} height={314} alt="" loading="lazy" decoding="async" />
                <img data-guide-art="pockets" src="/character/pose-pockets-body.webp" srcSet={introFinished ? "/character/pose-pockets-body.webp 124w, /character/pose-pockets-body@2x.webp 248w" : undefined} sizes="(max-width: 640px) 72px, (max-width: 1099px) 52px, clamp(51px, min(11.06svh, 7.11vw), 100px)" width={124} height={314} alt="" loading="lazy" decoding="async" />
                <img data-guide-art="back" src="/character/back.webp" width={124} height={314} alt="" loading="lazy" decoding="async" />
                <img data-guide-art="side" src="/character/side-right.webp" width={124} height={314} alt="" loading="lazy" decoding="async" />
                {Array.from({ length: 6 }, (_, index) => <img key={index} data-guide-walk={index} data-walk-src={`/character/walk-${index + 1}.webp`} width={192} height={314} alt="" decoding="async" />)}
                <span data-guide-head data-face={face}>
                  {faces.map((expression) => (
                    <img key={expression} data-guide-face={expression} src={`/character/${expression === "neutral" ? "head-neutral" : expression === "smirk" ? "head-smirk" : expression}.webp`}
                      srcSet={introFinished && expression === "smirk" ? "/character/head-smirk.webp 72w, /character/head-smirk@2x.webp 144w" : undefined}
                      sizes={expression === "smirk" ? "(max-width: 640px) 42px, (max-width: 1099px) 30px, clamp(30px, min(6.42svh, 4.13vw), 58px)" : undefined}
                      width={72} height={80} alt="" loading="lazy" decoding="async" />
                  ))}
                  <img data-guide-fallback src="/character/neutral-look.webp" width={72} height={80} alt="" loading="lazy" decoding="async" />
                  <img data-guide-pupils src="/character/pupils.webp" width={72} height={80} alt="" loading="lazy" decoding="async" />
                  {introFinished && <img data-guide-blink src="/character/idle-blink.webp" width={72} height={80} alt="" loading="lazy" decoding="async" fetchPriority="low" />}
                </span>
                {(["wrist", "cuff", "think"] as const).map((gesture) => (
                  <img key={gesture} data-guide-gesture={gesture} data-gesture-src={`/character/idle-${gesture}.webp`} width={275} height={480} alt="" decoding="async" fetchPriority="low" />
                ))}
                <span className="guide-farewell">
                  <img src="/character/wave-body.webp" width={144} height={314} alt="" loading="lazy" decoding="async" />
                  <img data-guide-wave-hand src="/character/wave-hand.webp" width={144} height={314} alt="" loading="lazy" decoding="async" />
                </span>
              </span>
            </span></span></span></span></span>
          </button>
          {bubble && <p className="guide-bubble" role="status">{bubble}</p>}
        </div>
      </div>
      {process.env.NODE_ENV !== "production" && !introFinished && <label className="stomp-debug">Intro <input type="range" min="0" max="3.40" step=".01" defaultValue="0" /><output>0.00 s</output></label>}
    </div>
  );
}

import { gsap } from "gsap";
import { guideCharacter, stompIntro } from "@/data";
import type { createGuideMotion } from "./guideMotion";

interface StompElements {
  stage: HTMLElement;
  lane: HTMLElement;
  mover: HTMLElement;
  home: HTMLElement;
  scene: HTMLElement;
  motion: ReturnType<typeof createGuideMotion>;
  cut: () => void;
  complete: () => void;
}

export function playStompIntro({ stage, lane, mover, home, scene, motion, cut, complete }: StompElements) {
  const root = document.documentElement;
  const debug = root.hasAttribute("data-stomp-debug");
  const navigatorHints = navigator as Navigator & { deviceMemory?: number };
  const fast = matchMedia("(max-width: 740px), (pointer: coarse)").matches ||
    (navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4) ||
    (navigatorHints.deviceMemory !== undefined && navigatorHints.deviceMemory <= 4);
  const normalHeight = mover.offsetHeight;
  const normalWidth = mover.offsetWidth;
  const homeRect = home.getBoundingClientRect();
  const plateRect = stage.querySelector(".layer-svg")!.getBoundingClientRect();
  const H = gsap.utils.clamp(150, 260, innerHeight * .24);
  const S = plateRect.left + plateRect.width / 2;
  const stop = S - .7 * H;
  const tap = stop + .12 * H;
  const coil = tap - .30 * H;
  const start = stop - 1.8 * H;
  const local = (x: number) => x - innerWidth / 2;
  const normalX = (guideCharacter.anchors.about - .5) * Math.max(0, homeRect.width - normalWidth);
  const handoff = local(homeRect.left + homeRect.width / 2 + normalX);
  const floor = homeRect.bottom + .42 * H;
  const select = (selector: string) => mover.querySelector<HTMLElement>(selector)!;
  const effect = (selector: string) => scene.querySelector<HTMLElement>(selector)!;
  const step = select("[data-guide-step]");
  const jump = select("[data-guide-jump]");
  const tilt = select("[data-guide-tilt]");
  const flip = select("[data-guide-flip]");
  const head = select("[data-guide-head]");
  const actor = select(".guide-button");
  const spotlight = select(".stomp-spotlight");
  const shadow = select(".stomp-shadow");
  const note = select(".stomp-note");
  const question = select(".stomp-question");
  const ghost = select(".stomp-ghost");
  const dust = [...mover.querySelectorAll(".stomp-actor-fx b")];
  const walk = [...mover.querySelectorAll("[data-guide-walk]")];
  const dark = effect(".stomp-dark");
  const switchPlate = effect(".stomp-switch b");
  const switchLight = effect(".stomp-switch em");
  const halo = effect(".stomp-switch i");
  const ring = effect(".stomp-ring");
  const tickRing = effect(".stomp-tick");
  const label = effect(".stomp-impact span");
  const sparks = [...scene.querySelectorAll(".stomp-impact b")].slice(0, fast ? 3 : 6);
  const landingRings = [...lane.querySelectorAll<HTMLElement>(".stomp-landing-rings i")];
  const layers = [...stage.querySelectorAll("[data-layer-entry]")];
  const headlines = [...document.querySelectorAll("#ph-title")];
  const controls = [...document.querySelectorAll(".an-desktop a, .an-contact, .an-toggle, .ph-actions a")].filter(node => node.getClientRects().length);
  const slider = stage.querySelector<HTMLInputElement>(".stomp-debug input");
  const readout = stage.querySelector<HTMLOutputElement>(".stomp-debug output");
  const grounded = [scene.querySelector<HTMLElement>(".stomp-switch")!, scene.querySelector<HTMLElement>(".stomp-impact")!, lane.querySelector<HTMLElement>(".stomp-landing-rings")!];
  const reset = [mover, actor, step, jump, tilt, flip, head, spotlight, shadow, ...layers, ...headlines, ...controls];
  let active = true;
  let cutDone = false;
  let last = 0;
  let slow = 0;

  lane.dataset.intro = "";
  stage.dataset.intro = "";
  stage.style.setProperty("--stomp-height", H + "px");
  // These nodes are fixed to the viewport during the intro.
  lane.style.setProperty("--stomp-floor", floor + "px");
  scene.style.setProperty("--stomp-height", H + "px");
  for (const node of grounded) {
    node.style.setProperty("--stomp-x", S + "px");
    node.style.setProperty("--stomp-y", floor + "px");
  }
  root.setAttribute("data-stomp-playing", "");
  root.removeAttribute("data-stomp-pending");
  root.removeAttribute("data-stomp-ready");
  window.dispatchEvent(new Event(stompIntro.startedEvent));
  if (!debug) try { sessionStorage.setItem(stompIntro.sessionKey, "1"); } catch {}

  const timeline = gsap.timeline({ paused: true, onComplete: () => { if (!debug) finish(); } });
  const face = (value: string, position: number) => timeline.set(head, { attr: { "data-face": value } }, position);
  function pulse(node: HTMLElement, time: number, opacity: number, scale: number, duration: number) {
    timeline.fromTo(node, { opacity, scale: .2 }, { opacity: 0, scale, duration, ease: "power2.out", immediateRender: false }, time);
  }
  function puff(startIndex: number, time: number) {
    dust.slice(startIndex, startIndex + 3).forEach((node, index) => {
      timeline.fromTo(node, { opacity: .46, scale: .52, x: -.035 * H }, {
        opacity: 0, scale: 1.5, x: -(index + 1) * .06 * H, y: -.035 * H, duration: .22,
        ease: "power2.out", immediateRender: false,
      }, time + index * .01);
    });
  }

  gsap.set(mover, { x: local(start), y: 0, scale: 1 });
  gsap.set([actor, spotlight, shadow, note, question, ghost, ...dust, ring, tickRing, label, ...sparks, ...landingRings], { opacity: 0 });
  gsap.set(dark, { opacity: 1 });
  gsap.set(switchPlate, { opacity: .35 });
  gsap.set(halo, { opacity: .15 });
  gsap.set(switchLight, { opacity: 0 });
  gsap.set(layers, { opacity: 0, scale: .6, y: H * .1, transformOrigin: "50% 50%" });
  motion.pose("right");

  timeline.addLabel("dark", 0)
    .to(halo, { opacity: .35, duration: .30, ease: "sine.inOut" }, 0)
    .to(spotlight, { opacity: 1, duration: .3, ease: "power1.out" }, 0)
    .addLabel("walk-in", .30)
    .to(actor, { opacity: 1, duration: .14, ease: "power1.out" }, .30)
    .to(shadow, { opacity: .5, duration: .14 }, .30)
    .to(mover, { x: local(start + 1.8 * H * .08), duration: .12, ease: "power1.in" }, .30)
    .to(mover, { x: local(start + 1.8 * H * .86), duration: .48, ease: "none" }, .42)
    .to(mover, { x: local(stop), duration: .12, ease: "power2.out" }, .90);

  const heights = [0, -.020, -.006];
  for (let frame = 0; frame < 9; frame++) {
    const at = .30 + frame * .08;
    const pose = frame % 3;
    const sign = Math.floor(frame / 3) % 2 === 0 ? 1 : -1;
    const lean = [0, 1, .5][pose] * sign;
    timeline.set(flip, { attr: { "data-walking": "true" } }, at)
      .set(walk, { opacity: 0 }, at)
      .set(walk[frame % walk.length], { opacity: 1 }, at)
      .set(step, { y: heights[pose] * H, rotation: lean }, at)
      .set(head, { y: heights[pose] * H * .6, rotation: lean * .6 }, at + .08)
      .set(shadow, { scaleX: pose === 1 ? .94 : 1 }, at);
  }
  timeline.fromTo(note, { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .10, immediateRender: false }, .50)
    .to(note, { y: -.12 * H, duration: .55, ease: "sine.out" }, .50)
    .to(note, { x: .02 * H, duration: .14, ease: "sine.inOut", yoyo: true, repeat: 2 }, .51)
    .to(note, { opacity: 0, duration: .20 }, .85)
    .addLabel("discovery", .96)
    .to(tilt, { rotation: 2, duration: .06, ease: "power1.out" }, .96)
    .to(switchLight, { opacity: 1, duration: .06 }, 1.00)
    .to([halo, switchPlate], { opacity: .95, duration: .06 }, 1.00)
    .set(flip, { attr: { "data-walking": "" } }, 1.02)
    .set(walk, { opacity: 0 }, 1.02)
    .set(step, { y: 0, rotation: 0 }, 1.02)
    .to(tilt, { rotation: 0, duration: .06, ease: "power2.out" }, 1.02)
    .addLabel("deadpan-turn", 1.14)
    .to(flip, { scaleX: .70, duration: .07, ease: "power2.in" }, 1.14)
    .set(flip, { attr: { "data-pose": "front" } }, 1.21)
    .to(flip, { scaleX: 1.03, duration: .085, ease: "power2.out" }, 1.21)
    .to(flip, { scaleX: 1, duration: .035, ease: "power1.out" }, 1.295)
    .to(spotlight, { scale: 1.5, x: .10 * H, duration: .20, ease: "sine.inOut" }, 1.30);
  face("smirk", 1.21);
  face("neutral", 1.37);
  timeline.fromTo(question, { scale: 0, opacity: 1 }, { scale: 1.2, duration: .05, immediateRender: false }, 1.37)
    .to(question, { scale: 1, duration: .04 }, 1.42)
    .to(question, { opacity: 0, duration: .08 }, 1.54)
    .to(head, { rotation: 5, duration: .10, ease: "sine.inOut" }, 1.37)
    .to(tilt, { y: .01 * H, duration: .10 }, 1.37)
    .to(tilt, { rotation: -1, duration: .08 }, 1.47)
    .addLabel("tap", 1.62)
    .to(mover, { x: local(tap), duration: .12, ease: "power1.inOut" }, 1.62)
    .to(tilt, { rotation: 2, duration: .12 }, 1.62)
    .to(jump, { y: -.01 * H, duration: .06, yoyo: true, repeat: 1 }, 1.62)
    .to(jump, { y: .01 * H, duration: .04 }, 1.74)
    .to([switchPlate, switchLight], { y: .02 * H, duration: .04 }, 1.74)
    .to([switchPlate, switchLight, jump], { y: 0, duration: .04 }, 1.78)
    .to(head, { rotation: 8, duration: .08, ease: "sine.inOut" }, 1.82);
  pulse(tickRing, 1.74, .5, 1.2, .25);
  face("angry", 1.90);
  timeline.fromTo(head, { scale: 1.03 }, { scale: 1, rotation: 0, duration: .06, immediateRender: false }, 1.90)
    .addLabel("wind-up", 1.95)
    .to(mover, { x: local(coil), duration: .12, ease: "power1.inOut" }, 1.95)
    .to(tilt, { y: 0, rotation: -2, duration: .12 }, 1.95)
    .to(jump, { y: -.02 * H, duration: .06, yoyo: true, repeat: 1 }, 1.95)
    .to(jump, { scaleY: .94, scaleX: 1.03, rotation: -3, duration: .06 }, 2.07)
    .to(spotlight, { scale: 1.6, duration: .06 }, 2.07)
    .to(head, { rotation: -6, duration: .04 }, 2.08)
    .to(head, { rotation: 6, duration: .04 }, 2.12)
    .to(head, { rotation: 0, duration: .02 }, 2.16);
  for (const time of [2, 2.10, 2.17]) {
    timeline.to(switchLight, { scale: 1.03, duration: .025, yoyo: true, repeat: 1 }, time);
  }

  timeline.addLabel("stomp", 2.18)
    .to(jump, { scaleY: 1.06, scaleX: .97, rotation: -2, duration: .03 }, 2.18)
    .to(mover, { x: local(S), duration: .29, ease: "none" }, 2.21)
    .to(jump, { y: -.30 * H, rotation: 3, duration: .13, ease: "power2.out" }, 2.21)
    .to(jump, { y: 0, rotation: 5, duration: .16, ease: "power2.in" }, 2.34)
    .to(shadow, { opacity: .25, scale: .6, duration: .13 }, 2.21)
    .to(shadow, { opacity: .5, scale: 1, duration: .16 }, 2.34);
  puff(0, 2.18);
  if (!fast) {
    timeline.set(ghost, { opacity: .22, x: -.13 * H, rotation: -3 }, 2.20)
      .to(ghost, { y: -.25 * H, duration: .18, ease: "power2.out" }, 2.22)
      .to(ghost, { y: -.08 * H, opacity: 0, duration: .06 }, 2.40);
  }

  timeline.addLabel("impact", 2.50)
    .set(jump, { scaleY: .90, scaleX: 1.06, rotation: 2 }, 2.50)
    .set(label, { opacity: 1, scale: 1.3 }, 2.50)
    // The contact frame is held until 2.55.
    .to([switchPlate, switchLight], { y: .06 * H, duration: .05, ease: "power3.out" }, 2.55)
    .to(jump, { scaleY: .96, duration: .05 }, 2.55)
    .to(label, { scale: 1, duration: .08, ease: "power3.out" }, 2.55)
    .to(label, { opacity: 0, duration: .12 }, 2.78)
    .to(jump, { scaleY: 1.02, scaleX: 1, y: -.01 * H, rotation: 0, duration: .06 }, 2.60)
    .to(jump, { scaleY: 1, y: 0, duration: .04, ease: "elastic.out(1,0.6)" }, 2.66)
    .to(head, { rotation: 5, duration: .06 }, 2.58);
  face("neutral", 2.58);
  pulse(ring, 2.55, .80, 4, .40);
  sparks.forEach((spark, index) => {
    const angle = (-150 + index * (120 / Math.max(1, sparks.length - 1))) * Math.PI / 180;
    const vx = Math.cos(angle) * H * (.24 + index * .026);
    const vy = Math.sin(angle) * H * (.32 + index * .024);
    timeline.fromTo(spark, { opacity: 1, x: 0, y: 0, rotation: index * 29 }, {
      x: vx * .54, y: vy, duration: .16, ease: "power1.out", immediateRender: false,
    }, 2.55).to(spark, { x: vx, y: vy * .18, rotation: index * 29 + 50, opacity: 0, duration: .24, ease: "power1.in" }, 2.71);
  });
  [6, -4, 3, -2, 1].forEach((jolt, index) => {
    timeline.set([scene, lane], { x: jolt * H / 216, y: (index % 2 ? 1 : -1) * Math.abs(jolt) * .3 * H / 216 }, 2.55 + index * .03);
  });
  timeline.set([scene, lane], { x: 0, y: 0 }, 2.70);

  timeline.addLabel("lights", 2.68);
  for (const [time, opacity, duration] of [[2.68, .45, .03], [2.71, 1, .04], [2.75, .2, .02], [2.77, .8, .04], [2.81, 0, .04]]) {
    timeline.to(dark, { opacity, duration, ease: "none" }, time);
  }
  timeline.call(() => root.removeAttribute("data-stomp-lock"), [], 2.81)
    .to(spotlight, { opacity: 0, duration: .15 }, 2.75)
    .to(tilt, { rotation: -2, duration: .06, yoyo: true, repeat: 1 }, 2.68)
    .to(jump, { y: -.03 * H, duration: .06, yoyo: true, repeat: 1 }, 2.68)
    .to(head, { rotation: 0, duration: .06 }, 2.68)
    .call(removeOverlay, [], 2.95);
  face("surprised", 2.68);

  timeline.addLabel("stack-rise", 2.78);
  layers.forEach((layer, index) => {
    const time = 2.78 + index * .10;
    timeline.to(layer, { opacity: 1, duration: .08, ease: "power1.out" }, time)
      .to(layer, { scale: 1.04, y: 0, duration: .18, ease: "power2.out" }, time)
      .to(layer, { scale: 1, duration: .08, ease: "power1.inOut" }, time + .18)
      .to(mover, { y: -.14 * H * (index + 1), duration: .10, ease: "power2.out" }, time)
      .to(jump, { scaleY: .97, duration: .02, repeat: 1, yoyo: true }, time + .10);
    pulse(landingRings[index], time, .47, 2.2, .22);
  });
  face("happy", 2.98);
  timeline.to([switchPlate, switchLight], { y: .1 * H, opacity: 0, duration: .17 }, 2.78)
    .to(halo, { opacity: 0, duration: .17 }, 2.78)
    .fromTo(headlines, { y: 8, opacity: .86 }, { y: 0, opacity: 1, duration: .37, stagger: .07, immediateRender: false, ease: "power3.out" }, 2.80)
    .fromTo(controls, { y: 8, opacity: .76 }, { y: 0, opacity: 1, duration: .20, stagger: { amount: .10 }, immediateRender: false }, 2.95)
    .addLabel("handoff", 3.08)
    .to(mover, { x: handoff, scale: normalHeight / H, duration: .26, ease: "power2.out" }, 3.08)
    .to(jump, { y: -.04 * H, duration: .06, yoyo: true, repeat: 1, ease: "power2.out" }, 3.12);
  [-3, 2.3, -1.5].forEach((angle, index) => timeline.set(head, { rotation: angle }, 3.12 + index * .04));
  timeline.to(head, { rotation: 0, duration: .06 }, 3.24)
    .to(jump, { scaleY: .97, duration: .04 }, 3.24)
    .to(jump, { scaleY: 1, duration: .06, ease: "back.out(1.8)" }, 3.28);
  face("smirk", 3.34);
  timeline.to(shadow, { opacity: 0, duration: .08 }, 3.32).set(mover, { opacity: 1 }, stompIntro.seconds);

  function removeOverlay() {
    if (cutDone || debug) return;
    cutDone = true;
    cut();
    window.dispatchEvent(new Event(stompIntro.cutEvent));
  }
  function frameGuard() {
    const now = performance.now();
    slow = last && now - last > 50 ? slow + 1 : 0;
    last = now;
    if (slow >= 3) finish();
  }
  const inputs = ["pointerdown", "keydown", "wheel", "touchstart", "scroll", "click"] as const;
  function interrupt(event: Event) {
    if (event instanceof KeyboardEvent && event.key === "Tab" && document.activeElement?.id !== "stomp-skip") return;
    finish();
  }
  function scrub() {
    if (!slider) return;
    const seconds = Number(slider.value);
    timeline.time(seconds);
    root.toggleAttribute("data-stomp-lock", seconds < 2.81);
    if (readout) readout.value = seconds.toFixed(2) + " s";
  }
  function finish(notify = true) {
    if (!active) return;
    active = false;
    const skipFocused = document.activeElement?.id === "stomp-skip";
    for (const input of inputs) window.removeEventListener(input, interrupt, true);
    window.removeEventListener("resize", interrupt);
    slider?.removeEventListener("input", scrub);
    gsap.ticker.remove(frameGuard);
    if (notify) timeline.progress(1, true);
    timeline.kill();
    delete lane.dataset.intro;
    delete stage.dataset.intro;
    stage.style.removeProperty("--stomp-height");
    lane.style.removeProperty("--stomp-floor");
    root.removeAttribute("data-stomp-playing");
    root.removeAttribute("data-stomp-lock");
    root.removeAttribute("data-stomp-debug");
    gsap.set(reset, { clearProps: "transform,opacity" });
    motion.pose("front");
    flip.removeAttribute("data-walking");
    head.dataset.face = "smirk";
    gsap.set(mover, { x: normalX });
    if (notify) {
      removeOverlay();
      complete();
      if (skipFocused) document.querySelector<HTMLElement>(".an-brand")?.focus({ preventScroll: true });
    }
  }
  if (debug) {
    slider?.addEventListener("input", scrub);
    timeline.pause(0);
  } else {
    for (const input of inputs) window.addEventListener(input, interrupt, { capture: true, passive: true });
    window.addEventListener("resize", interrupt, { passive: true });
    gsap.ticker.add(frameGuard);
    timeline.timeScale(fast ? stompIntro.fastScale : 1).play(0);
  }
  return { get active() { return active; }, finish, destroy: () => finish(false) };
}

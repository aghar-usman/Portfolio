import { gsap } from "gsap";
import { guideCharacter, type StorySection } from "@/data";

export type GuidePose = "front" | "back" | "left" | "right";

export function createGuideMotion(lane: HTMLElement, mover: HTMLElement) {
  const flip = mover.querySelector<HTMLElement>("[data-guide-flip]")!;
  const step = mover.querySelector<HTMLElement>("[data-guide-step]")!;
  const jump = mover.querySelector<HTMLElement>("[data-guide-jump]")!;
  const tilt = mover.querySelector<HTMLElement>("[data-guide-tilt]")!;
  const head = mover.querySelector<HTMLElement>("[data-guide-head]")!;
  const pupils = mover.querySelector<HTMLElement>("[data-guide-pupils]")!;
  const acting = mover.querySelector<HTMLElement>("[data-guide-acting]")!;
  const gestures = [...mover.querySelectorAll<HTMLImageElement>("[data-gesture-src]")];
  const walkFrames = [...mover.querySelectorAll<HTMLImageElement>("[data-guide-walk]")];
  let walkArtRequested = false;
  let direction: GuidePose = "front";
  let desired: GuidePose = "front";
  let turning: gsap.core.Timeline | undefined;
  let walking: gsap.core.Timeline | undefined;
  let hopping: gsap.core.Timeline | undefined;
  let leaning: gsap.core.Timeline | undefined;
  let idle: gsap.core.Timeline | undefined;

  function pose(view: GuidePose) {
    direction = desired = view;
    flip.dataset.pose = view;
    gsap.set(flip, { scaleX: view === "left" ? -1 : 1 });
  }

  function turn(view: GuidePose) {
    if (desired === view) return;
    desired = view;
    turning?.kill();
    const sign = view === "left" ? -1 : 1;
    turning = gsap.timeline()
      .to(flip, { scaleX: direction === "left" ? -.6 : .6, duration: .075, ease: "power2.in" })
      .call(() => { direction = view; flip.dataset.pose = view; })
      .set(flip, { scaleX: .6 * sign })
      .to(flip, { scaleX: sign, duration: .075, ease: "power2.out" });
  }

  const xFor = (anchor: number) => (anchor - .5) * Math.max(0, lane.clientWidth - mover.offsetWidth);

  function addWalk(timeline: gsap.core.Timeline, toX: number, duration: number, at: number) {
    const steps = Math.max(1, Math.round(duration / .23));
    const stepDuration = duration / (steps * 2);
    timeline.to(mover, { x: toX, duration, ease: "power1.inOut" }, at);
    for (let index = 0; index < steps; index++) {
      const position = at + index * stepDuration * 2;
      timeline.to(step, { y: -4, rotation: index % 2 ? 2 : -2, duration: stepDuration, ease: "sine.out" }, position)
        .to(step, { y: 0, rotation: 0, duration: stepDuration, ease: "sine.in" }, position + stepDuration);
    }
  }

  function warmWalkArt() {
    if (walkArtRequested) return;
    walkArtRequested = true;
    for (const frame of walkFrames) frame.src = frame.dataset.walkSrc!;
  }

  function walk(toX: number, fromEdge = false) {
    warmWalkArt();
    walking?.kill();
    flip.removeAttribute("data-walking");
    gsap.set(walkFrames, { opacity: 0 });
    if (fromEdge) gsap.set(mover, { x: lane.clientWidth * .62 + mover.offsetWidth / 2, opacity: 0 });
    const from = Number(gsap.getProperty(mover, "x"));
    if (Math.abs(toX - from) < 4) return;
    turn(toX < from ? "left" : "right");
    walking = gsap.timeline({
      onComplete: () => {
        flip.removeAttribute("data-walking");
        gsap.set(walkFrames, { opacity: 0 });
        turn("front");
      },
    });
    addWalk(walking, toX, .64, 0);
    walking.to(mover, { opacity: 1, duration: .16 }, 0);
    if (!walkFrames.every(frame => frame.naturalWidth)) return;
    walkFrames.forEach((frame, index) => {
      const at = .08 + index * .085;
      walking!.set(flip, { attr: { "data-walking": "true" } }, at)
        .set(walkFrames, { opacity: 0 }, at)
        .set(frame, { opacity: 1 }, at);
    });
  }

  function hop() {
    hopping?.kill();
    hopping = gsap.timeline()
      .to(jump, { scaleX: 1.10, scaleY: .86, y: 0, duration: .08, ease: "power2.in" })
      .to(jump, { scaleX: .94, scaleY: 1.10, y: -21, duration: .15, ease: "power2.out" })
      .to(jump, { scaleX: 1.11, scaleY: .88, y: 0, duration: .17, ease: "power2.in" })
      .to(jump, { scaleX: 1, scaleY: 1, duration: .10, ease: "power2.out" });
  }

  function lean(deg: number, lift = 0) {
    leaning?.kill();
    leaning = gsap.timeline()
      .to(tilt, { rotation: gsap.utils.clamp(-5, 5, deg), y: lift, duration: .17, ease: "power2.out" })
      .to(tilt, { rotation: 0, y: 0, duration: .24, ease: "power2.out" }, ">+.12");
  }

  function peek(toX: number) {
    walking?.kill();
    flip.removeAttribute("data-walking");
    gsap.set(walkFrames, { opacity: 0 });
    gsap.set(mover, { x: lane.clientWidth * .6 + mover.offsetWidth });
    turn("left");
    walking = gsap.timeline().to(mover, { x: toX, duration: .48, ease: "power3.out" })
      .call(() => { turn("front"); hop(); });
  }

  const cursorTilt = mover.querySelector<HTMLElement>("[data-guide-cursor]")!;
  const liveLean = gsap.quickTo(cursorTilt, "rotation", { duration: .24, ease: "power2.out" });
  const liveHead = gsap.quickTo(head, "x", { duration: .23, ease: "power2.out" });
  const liveEyes = gsap.quickTo(pupils, "x", { duration: .20, ease: "power2.out" });

  function look(distance: number) {
    const direction = gsap.utils.clamp(-1, 1, distance);
    liveLean(direction * 4);
    liveHead(direction * 1.5);
    liveEyes(direction * 1.1);
  }

  function stopIdle() {
    idle?.revert();
    idle = undefined;
    flip.removeAttribute("data-idle-action");
    flip.removeAttribute("data-idle-gesture");
    head.removeAttribute("data-idle-blink");
  }

  const idleAction = (section: StorySection, count: number) => {
    const choices = guideCharacter.idle.sections[section];
    return choices[count % choices.length];
  };

  function warmIdleArt(section: StorySection, count: number) {
    const action = idleAction(section, count);
    for (const image of gestures) {
      const pose = image.dataset.guideGesture;
      if (!image.hasAttribute("src") && (pose === action || (action === "cuff" && pose === "wrist"))) {
        image.src = image.dataset.gestureSrc!;
      }
    }
  }

  function idleVariety(section: StorySection, count: number) {
    stopIdle();
    const next = idleAction(section, count);
    const pending = gestures.some(image => {
      const pose = image.dataset.guideGesture;
      return (pose === next || (next === "cuff" && pose === "wrist")) && !image.naturalWidth;
    });
    const action = pending ? "scan" : next;
    flip.dataset.idleAction = action;
    const timeline = gsap.timeline({
      defaults: { ease: "sine.inOut" },
      onComplete: () => { flip.removeAttribute("data-idle-action"); },
    });
    idle = timeline;
    function blink(at: number) {
      timeline.set(head, { attr: { "data-idle-blink": "true" } }, at)
        .set(head, { attr: { "data-idle-blink": "" } }, at + .10);
    }
    switch (action) {
      case "stretch":
        timeline.to(acting, { scaleY: 1.045, rotation: -2, duration: .36 }, 0)
          .to(head, { y: -2, rotation: -5, duration: .32 }, .04)
          .to(acting, { scaleY: 1, rotation: 0, duration: .46 }, .50)
          .to(head, { y: 0, rotation: 0, duration: .40 }, .54);
        blink(.60);
        break;
      case "scan":
        timeline.to(head, { rotation: -7, y: 1.5, scaleX: .96, duration: .24 }, 0)
          .to(acting, { rotation: -1.8, duration: .28 }, .07)
          .to(head, { rotation: 5, y: -1, scaleX: .97, duration: .30 }, .45)
          .to(head, { rotation: 0, y: 0, scaleX: 1, duration: .26 }, .91)
          .to(acting, { rotation: 0, duration: .32 }, .82);
        blink(.77);
        break;
      case "think":
        timeline.to(acting, { rotation: -2, duration: .19 }, 0)
          .set(flip, { attr: { "data-idle-gesture": "think" } }, .15)
          .to(acting, { rotation: 2, duration: .24 }, .19)
          .to(acting, { rotation: -1, duration: .32 }, .77)
          .set(flip, { attr: { "data-idle-gesture": "" } }, 1.05)
          .to(acting, { rotation: 0, duration: .20 }, 1.05);
        blink(1.12);
        break;
      case "cuff":
        timeline.to(acting, { rotation: 2, duration: .19 }, 0)
          .set(flip, { attr: { "data-idle-gesture": "wrist" } }, .15)
          .set(flip, { attr: { "data-idle-gesture": "cuff" } }, .46)
          .to(acting, { rotation: -1.5, duration: .30 }, .48)
          .set(flip, { attr: { "data-idle-gesture": "" } }, 1.02)
          .to(acting, { rotation: 0, duration: .31 }, .99);
        blink(1.07);
        break;
      case "nod":
        timeline.to(head, { y: 3, rotation: 4, duration: .17 }, 0)
          .to(acting, { rotation: 1.4, duration: .23 }, .06)
          .to(head, { y: -1, rotation: -2, duration: .24 }, .19)
          .to(head, { y: 0, rotation: 0, duration: .24 }, .45)
          .to(acting, { rotation: 0, duration: .28 }, .37);
        blink(.17);
        break;
      case "blink":
        blink(0);
        blink(.23);
        break;
    }
  }

  function destroy() {
    stopIdle();
    for (const timeline of [turning, walking, hopping, leaning]) timeline?.kill();
    for (const control of [liveLean, liveHead, liveEyes]) control.tween.kill();
    gsap.set([flip, step, jump, tilt, head, pupils, cursorTilt, mover], { clearProps: "transform,opacity" });
    gsap.set(walkFrames, { opacity: 0 });
    flip.removeAttribute("data-walking");
    flip.dataset.pose = "front";
  }

  return { pose, turn, addWalk, walk, warmWalkArt, hop, lean, peek, look, warmIdleArt, idleVariety, stopIdle, destroy, xFor,
    idling: () => Boolean(idle?.isActive()),
    moving: () => Boolean(walking?.isActive() || hopping?.isActive() || turning?.isActive()),
  };
}

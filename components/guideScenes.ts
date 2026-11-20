import { gsap } from "gsap";
import type { StorySection } from "@/data";

export function createGuideScenes(story: Element, actor: HTMLElement) {
  const rig = actor.querySelector("[data-guide-flip]")!;
  const body = actor.querySelector("[data-guide-tilt]")!;
  const hand = actor.querySelector("[data-guide-wave-hand]")!;
  const seen = new Set<StorySection>();
  let current: gsap.core.Timeline | undefined;

  function stop() { current?.revert(); }

  function play(section: StorySection) {
    if (section === "about" || (seen.has(section) && section !== "contact")) return;
    seen.add(section);
    stop();
    current = gsap.timeline({ defaults: { ease: "power2.out" } });
    switch (section) {
      case "skills": {
        const heading = story.querySelector("#cs-title");
        if (!heading) break;
        current.fromTo(body, { rotation: 0 }, { rotation: -5, duration: .15 }, .26)
          .fromTo(heading, { x: 0 }, { x: -9, duration: .11 }, .37)
          .to(heading, { x: 1.5, duration: .18, ease: "power2.inOut" }, .48)
          .to([heading, body], { x: 0, rotation: 0, duration: .14, clearProps: "transform" }, .66);
        break;
      }
      case "experience": {
        current.to(body, { rotation: 3, duration: .13, yoyo: true, repeat: 1 }, .5);
        break;
      }
      case "projects": {
        const index = story.querySelector(".ap-reel-index");
        if (index) current.fromTo(index, { x: 4 }, { x: 0, duration: .30, clearProps: "transform" }, .34);
        break;
      }
      case "education": {
        const actual = story.querySelector("[data-guide-correction]");
        const typo = story.querySelector("[data-guide-typo]");
        const letters = typo?.querySelector("span");
        const letterO = story.querySelector("[data-guide-ink-hole]");
        const fullStop = story.querySelector("[data-guide-ink-stop]");
        const packet = document.querySelector(".guide-story-ink i");
        const ripple = document.querySelector(".guide-story-ink b");
        if (!actual || !typo || !letters || !letterO || !fullStop || !packet || !ripple) break;
        const fromX = () => { const rect = actor.getBoundingClientRect(); return rect.left + rect.width * .25; };
        const fromY = () => { const rect = actor.getBoundingClientRect(); return rect.top + rect.height * .48; };
        const gateX = () => { const rect = letterO.getBoundingClientRect(); return rect.left + rect.width * .50; };
        const gateY = () => { const rect = letterO.getBoundingClientRect(); return rect.top + rect.height * .57; };
        const endX = () => { const rect = fullStop.getBoundingClientRect(); return rect.left + rect.width * .50; };
        const endY = () => { const rect = fullStop.getBoundingClientRect(); return rect.bottom - rect.height * .19; };
        current.set(actual, { opacity: 0 }, .33)
          .set(typo, { opacity: 1 }, .33)
          .to(body, { rotation: -4, duration: .15 }, .36)
          .to(letters, { y: -5, duration: .11, yoyo: true, repeat: 1 }, .43)
          .set(typo, { opacity: 0 }, .62)
          .set(actual, { opacity: 1 }, .62)
          .set(fullStop, { opacity: .22 }, .41)
          .fromTo(packet, { opacity: 1, x: fromX, y: fromY, scale: .7 }, { x: () => (fromX() + gateX()) / 2, y: () => Math.min(fromY(), gateY()) - 24, scale: 1, duration: .19, ease: "power1.out", immediateRender: false }, .42)
          .to(packet, { x: gateX, y: gateY, scale: .65, duration: .15, ease: "power1.in" }, .61)
          .to(packet, { x: endX, y: endY, scale: .75, duration: .13, ease: "power2.in" }, .76)
          .set(packet, { opacity: 0 }, .89)
          .fromTo(ripple, { x: endX, y: endY, scale: .4, opacity: .65 }, { scale: 2.6, opacity: 0, duration: .24, immediateRender: false }, .89)
          .to(fullStop, { opacity: 1, duration: .12, clearProps: "opacity" }, .89)
          .to(body, { rotation: 0, duration: .18, clearProps: "transform" }, .72);
        break;
      }
      case "contact": {
        current.set(rig, { attr: { "data-farewell": "true" } }, .68)
          .fromTo(hand, { rotation: -4 }, { rotation: 9, duration: .14, yoyo: true, repeat: 3, ease: "sine.inOut" }, .70)
          .to(hand, { rotation: 0, duration: .10 }, 1.26)
          .set(rig, { attr: { "data-farewell": "" } }, 1.50);
        break;
      }
    }
  }
  return { play, stop };
}

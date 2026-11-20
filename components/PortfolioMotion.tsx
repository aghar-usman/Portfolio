"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function PortfolioMotion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const lenis = new Lenis({
        lerp: 0.16,
        anchors: true,
        syncTouch: false,
        prevent: (node) => node.matches("dialog, .pg-panel"),
        virtualScroll: () => document.body.style.overflow !== "hidden",
      });

      const tick = () => lenis.raf(performance.now());
      const unsubscribe = lenis.on("scroll", () => ScrollTrigger.update());
      gsap.ticker.add(tick, false, true);

      return () => {
        gsap.ticker.remove(tick);
        unsubscribe?.();
        lenis.destroy();
      };
    });
    return () => media.revert();
  }, []);

  return null;
}

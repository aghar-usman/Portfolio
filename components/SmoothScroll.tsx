"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

export default function SmoothScroll(){
  useEffect(()=>{
    const media=matchMedia("(prefers-reduced-motion: reduce)");
    let dispose=()=>{};
    const setup=()=>{
      dispose();
      if(media.matches)return;
      gsap.registerPlugin(ScrollTrigger);
      const lenis=new Lenis({duration:1.05,smoothWheel:true,syncTouch:false,anchors:{offset:-24,duration:1.05}});
      const tick=(time:number)=>lenis.raf(time*1000);
      const resize=()=>lenis.resize();
      lenis.on("scroll",ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      ScrollTrigger.addEventListener("refresh",resize);
      dispose=()=>{gsap.ticker.remove(tick);ScrollTrigger.removeEventListener("refresh",resize);lenis.destroy();gsap.ticker.lagSmoothing(500,33);};
    };
    setup();
    media.addEventListener("change",setup);
    return()=>{media.removeEventListener("change",setup);dispose();};
  },[]);
  return null;
}

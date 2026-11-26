"use client";
import { animate, useInView, useMotionValue, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

// Adapted from Skiper37 AnimatedNumber_002. Uses the portfolio's existing
// Motion package; exposes the final value to assistive technology throughout.
export function AnimatedNumber({ value, decimals=0 }: { value:number; decimals?:number }) {
  const ref=useRef<HTMLSpanElement>(null);
  const visible=useInView(ref,{once:true,amount:.7});
  const reduced=useReducedMotion();
  const number=useMotionValue(0);
  useEffect(()=>{
    if(reduced){if(ref.current)ref.current.textContent=value.toFixed(decimals);return;}
    if(!visible)return;
    const unsubscribe=number.on("change",next=>{if(ref.current)ref.current.textContent=next.toFixed(decimals);});
    const controls=animate(number,value,{duration:1.6,ease:[.22,1,.36,1]});
    return()=>{controls.stop();unsubscribe();};
  },[visible,reduced,number,value,decimals]);
  return <span role="img" aria-label={value.toFixed(decimals)}><span ref={ref} aria-hidden="true">{value.toFixed(decimals)}</span></span>;
}
/* Skiper37 by @gurvinder-singh02, https://gxuri.me.
 * Free to use and modify in personal and commercial projects with Skiper UI attribution.
 * Inspired by https://number-flow.barvian.me/. Portfolio adaptation uses Motion.
 */

"use client";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";

// Adapted from Skiper61 SpringMouseFollow: bounded motion around the original
// button position keeps its destination predictable and touch targets steady.
export function Magnetic({ children, className }: {children:ReactNode;className?:string}) {
  const reduced=useReducedMotion();
  const x=useSpring(0,{mass:.1,damping:10,stiffness:131});
  const y=useSpring(0,{mass:.1,damping:10,stiffness:131});
  const reset=()=>{x.set(0);y.set(0);};
  return <motion.div className={className} style={{x,y}} onPointerMove={event=>{
    if(reduced||event.pointerType!=="mouse"||!matchMedia("(hover: hover) and (pointer: fine)").matches)return;
    const bounds=event.currentTarget.getBoundingClientRect();
    x.set(Math.max(-10,Math.min(10,(event.clientX-bounds.left-bounds.width/2)*.15)));
    y.set(Math.max(-10,Math.min(10,(event.clientY-bounds.top-bounds.height/2)*.15)));
  }} onPointerLeave={reset} onBlur={reset}>{children}</motion.div>;
}
/* Skiper61 Mouse Follow, free component from https://skiper-ui.com/registry/skiper61.json.
 * Adapted for portfolio use; attribution appears in the footer.
 */

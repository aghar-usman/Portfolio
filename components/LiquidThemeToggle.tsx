"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal, flushSync } from "react-dom";
import { Moon, Sun } from "lucide-react";
import { animate, spring } from "animejs";
import s from "./LiquidThemeToggle.module.css";

type Transition = { ready:Promise<void>; finished:Promise<void>; skipTransition:()=>void };
type TransitionDocument = Document & { startViewTransition?:(update:()=>void)=>Transition };

// Twenty-two uneven fingers, rather than a circular wipe. The same contour
// drives native snapshot clipping and the canvas fallback.
function contour(progress:number,x:number,y:number,radius:number){
  const p=Math.max(0,Math.min(1,progress));
  const reach=1-Math.pow(1-p,2);
  return Array.from({length:176},(_,i)=>{
    const a=i/176*Math.PI*2;
    const finger=Math.pow((1+Math.cos(a*22+Math.sin(a*3)*.8))/2,5);
    const ripple=Math.sin(a*7+reach*9)*.035;
    const r=radius*(reach+(finger*.28+ripple)*Math.sin(Math.PI*reach));
    return [x+Math.cos(a)*Math.max(0,r),y+Math.sin(a)*Math.max(0,r)];
  });
}
const liquidPath=(points:number[][])=>{
  const last=points[points.length-1],first=points[0];
  let path=`M${((last[0]+first[0])/2).toFixed(1)} ${((last[1]+first[1])/2).toFixed(1)}`;
  points.forEach(([x,y],i)=>{const next=points[(i+1)%points.length];path+=`Q${x.toFixed(1)} ${y.toFixed(1)} ${((x+next[0])/2).toFixed(1)} ${((y+next[1])/2).toFixed(1)}`;});
  return `path('${path}Z')`;
};

export default function LiquidThemeToggle({dark,onToggle,className=""}:{dark:boolean;onToggle:()=>void;className?:string}){
  const [busy,setBusy]=useState(false);
  const [mounted,setMounted]=useState(false);
  const canvas=useRef<HTMLCanvasElement>(null);
  const frame=useRef(0);
  const membrane=useRef<HTMLSpanElement>(null);
  const settle=useRef<ReturnType<typeof animate>|null>(null);
  const running=useRef(false);
  const transition=useRef<Transition|null>(null);
  useEffect(()=>{const id=setTimeout(()=>setMounted(true),0);return()=>{clearTimeout(id);cancelAnimationFrame(frame.current);transition.current?.skipTransition();settle.current?.cancel();};},[]);
  const settleLiquid=()=>{
    if(!membrane.current||running.current||matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches)return;
    settle.current?.cancel();
    settle.current=animate(membrane.current,{scaleX:{from:1.035,to:1},scaleY:{from:.965,to:1},ease:spring({duration:360,bounce:.12})});
  };
  function change(button:HTMLButtonElement){
    if(running.current)return;
    if(matchMedia("(prefers-reduced-motion: reduce)").matches){onToggle();return;}
    const rect=button.getBoundingClientRect(),x=rect.left+rect.width/2,y=rect.top+rect.height/2;
    const width=innerWidth,height=innerHeight;
    const radius=Math.max(Math.hypot(x,y),Math.hypot(width-x,y),Math.hypot(x,height-y),Math.hypot(width-x,height-y))*1.04;
    const entering=!dark;
    running.current=true;setBusy(true);
    document.documentElement.dataset.liquidDirection=entering?"night":"day";
    const finish=()=>{running.current=false;setBusy(false);delete document.documentElement.dataset.liquidDirection;transition.current=null;};
    const start=(document as TransitionDocument).startViewTransition;
    if(start){
      const vt=start.call(document,()=>flushSync(onToggle));transition.current=vt;
      void vt.ready.then(()=>{
        const frames=Array.from({length:33},(_,i)=>({clipPath:liquidPath(contour(entering?i/32:1-i/32,x,y,radius))}));
        const reveal=document.documentElement.animate(frames,{duration:entering?1300:1050,easing:"linear",fill:"both",pseudoElement:entering?"::view-transition-new(root)":"::view-transition-old(root)"});
        // Keep the final mask applied until the snapshot layer is gone. Removing
        // it earlier briefly exposes the complete old (dark) snapshot again.
        void vt.finished.then(()=>reveal.cancel(),()=>reveal.cancel());
        return reveal.finished;
      }).catch(()=>vt.skipTransition());
      void vt.finished.then(finish,finish);
      return;
    }
    const surface=canvas.current,ctx=surface?.getContext("2d");
    if(!surface||!ctx){onToggle();finish();return;}
    const ratio=Math.min(devicePixelRatio||1,1.5);
    surface.width=Math.round(width*ratio);surface.height=Math.round(height*ratio);ctx.scale(ratio,ratio);
    surface.style.opacity="1";
    let startTime:number|undefined,committed=false;
    const paint=(now:number)=>{
      startTime??=now;
      const t=Math.min(1,(now-startTime)/1500);
      // Cover the current theme before changing it, then retract to reveal day
      // or dissolve into the dark canvas. No screenshot API or external assets.
      const p=entering?Math.min(1,t/.8):t<.2?Math.min(1,t/.2):1-(t-.2)/.8;
      if(!committed&&t>(entering?.8:.2)){flushSync(onToggle);committed=true;}
      ctx.clearRect(0,0,width,height);
      const points=contour(p,x,y,radius);
      ctx.beginPath();const first=points[0],last=points[points.length-1];ctx.moveTo((first[0]+last[0])/2,(first[1]+last[1])/2);points.forEach(([px,py],i)=>{const next=points[(i+1)%points.length];ctx.quadraticCurveTo(px,py,(px+next[0])/2,(py+next[1])/2);});ctx.closePath();
      ctx.fillStyle="#070709";ctx.fill();
      const wet=ctx.createLinearGradient(0,0,width,height);wet.addColorStop(0,"#c7ccde65");wet.addColorStop(.45,"#14141c");wet.addColorStop(1,"#74798e55");ctx.strokeStyle=wet;ctx.lineWidth=2;ctx.stroke();
      if(entering&&t>.8)surface.style.opacity=String((1-t)/.2);
      if(t<1)frame.current=requestAnimationFrame(paint);else{ctx.clearRect(0,0,width,height);surface.style.opacity="0";if(!committed)onToggle();finish();}
    };
    frame.current=requestAnimationFrame(paint);
  }
  return <><button type="button" className={`${className} ${s.toggle}`} data-dark={dark} data-tooltip={`Switch to ${dark?"light":"dark"}`} disabled={busy} aria-label={`Preview ${dark?"light":"dark"} mode`} aria-pressed={dark} onPointerEnter={settleLiquid} onClick={e=>change(e.currentTarget)}><span ref={membrane} className={s.life} aria-hidden="true">{Array.from({length:3},(_,i)=><i key={i}/>)}</span>{dark?<Sun size={19} aria-hidden="true"/>:<Moon size={19} aria-hidden="true"/>}</button>{mounted&&createPortal(<canvas ref={canvas} className={s.canvas} aria-hidden="true"/>,document.body)}</>;
}

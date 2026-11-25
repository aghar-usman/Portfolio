"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./StackPlotter.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);
const nodes=[{name:"UI",items:["React","Next.js","TypeScript","Tailwind CSS"]},{name:"API",items:["Python","Flask","FastAPI","REST APIs"]},{name:"DATA",items:["PostgreSQL","MSSQL","SQL","ETL pipelines"]}];
const moreTools=["LLM integration","Text-to-SQL","Prompt engineering","Ollama","Llama 3","Mistral","Claude","HuggingFace","TensorFlow","PyTorch","OpenCV","JavaScript","HTML5","CSS3","MySQL","SQLite","Pandas","NumPy","Docker","Git/GitHub","Linux","GCP","CI/CD","Vercel","Motion","GSAP"];
function Icon({index}:{index:number}){return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">{index===0?<><rect x="10" y="10" width="11" height="11" rx="2"/><rect x="27" y="10" width="11" height="11" rx="2"/><rect x="10" y="27" width="11" height="11" rx="2"/><rect x="27" y="27" width="11" height="11" rx="2"/></>:index===1?<><path d="m20 7 8 0 1 6 5 3 6-2 4 7-5 4v6l4 4-4 7-6-2-5 3-1 5h-8l-1-5-5-3-6 2-4-7 5-4v-6l-5-4 4-7 6 2 5-3Z" transform="translate(0 -4) scale(.95)"/><circle cx="24" cy="24" r="7"/></>:<><ellipse cx="24" cy="11" rx="15" ry="6"/><path d="M9 11v25c0 8 30 8 30 0V11M9 23c0 8 30 8 30 0M9 35c0 8 30 8 30 0"/></>}</svg>}

export default function StackPlotter(){
  const root=useRef<HTMLElement>(null);
  const [more,setMore]=useState(false);
  useEffect(()=>{ScrollTrigger.refresh();},[more]);
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add("(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)",()=>{
      const el=root.current!;el.dataset.plotter="active";
      const stage=el.querySelector<HTMLElement>(`.${s.stage}`)!;
      const dot=el.querySelector<HTMLElement>(`.${s.dot}`)!;
      const heading=el.querySelector<HTMLElement>(`.${s.heading}`)!;
      const anchor=el.querySelector<HTMLElement>(`.${s.anchor}`)!;
      const bus=el.querySelector<SVGPathElement>(`.${s.bus}`)!;
      const strokes=Array.from(el.querySelectorAll<SVGGeometryElement>(`.${s.graph} path, .${s.node} svg rect, .${s.node} svg path, .${s.node} svg circle, .${s.node} svg ellipse`));
      strokes.forEach(path=>{const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});});
      const point=(element:Element,x=.5,y=.5)=>{const a=element.getBoundingClientRect(),b=stage.getBoundingClientRect();return{x:a.left-b.left+a.width*x-7,y:a.top-b.top+a.height*y-7};};
      const headingStart=()=>point(heading,0,.65);
      const landing=()=>point(anchor,.5,.5);
      const nodeEls=Array.from(el.querySelectorAll<HTMLElement>(`.${s.node}`));
      gsap.set(dot,{...headingStart(),scale:0});
      gsap.set(heading,{clipPath:"inset(0 100% 0 0)"});
      gsap.set(`.${s.subtitle}, .${s.nodeLabel}, .${s.item}, .${s.foot}`,{autoAlpha:0});
      gsap.set(`.${s.icon}`,{borderColor:"transparent"});
      gsap.set(`.${s.splash} i`,{scale:0,opacity:0});
      const tl=gsap.timeline({scrollTrigger:{trigger:el,start:"top top",end:"+=220%",scrub:.7,pin:stage,invalidateOnRefresh:true},defaults:{ease:"none"}});
      tl.to(dot,{scale:1,duration:.04,ease:"back.out(2.5)"},0)
        .to(dot,{x:()=>landing().x,y:()=>headingStart().y,duration:.25},.04)
        .to(heading,{clipPath:"inset(0 0% 0 0)",duration:.25},.04)
        .to(`.${s.subtitle}`,{autoAlpha:1,duration:.08},.22)
        .to(dot,{x:()=>point(bus,0,0).x,y:()=>point(bus,0,0).y,duration:.04},.30)
        .to(bus,{strokeDashoffset:0,duration:.36},.34)
        .to(dot,{x:()=>point(bus,1,0).x,y:()=>point(bus,1,0).y,duration:.36},.34);
      nodeEls.forEach((node,i)=>{
        const at=.35+i*.105;
        tl.to(node.querySelector(`.${s.icon}`),{borderColor:"#ff5a3638",duration:.07},at)
          .to(node.querySelectorAll('svg path,svg rect,svg circle,svg ellipse'),{strokeDashoffset:0,duration:.065,stagger:.006},at+.015)
          .to(node.querySelector(`.${s.nodeLabel}`),{autoAlpha:1,duration:.04},at+.055);
      });
      tl.to(`.${s.stem}`,{strokeDashoffset:0,duration:.1,stagger:.008},.70)
        .to(`.${s.item}`,{autoAlpha:1,duration:.025,stagger:.007},.71)
        .to(dot,{x:()=>point(nodeEls[2],.5,1).x,y:()=>point(nodeEls[2],.5,1).y+125,duration:.11},.70)
        .to(dot,{x:()=>landing().x,duration:.16,ease:"power2.inOut"},.82)
        .to(dot,{y:()=>landing().y-120,duration:.075,ease:"power2.out"},.82)
        .to(dot,{y:()=>landing().y,duration:.085,ease:"bounce.out"},.895)
        .to(dot,{scaleX:1.25,scaleY:.8,duration:.009,repeat:1,yoyo:true},.98)
        .to(`.${s.splash} i`,{scale:1,opacity:1,duration:.006},.974)
        .to(`.${s.splash} i`,{x:(i)=>Math.cos(i*Math.PI/3)*28,y:(i)=>Math.sin(i*Math.PI/3)*23,opacity:0,scale:.3,duration:.02},.98)
        .to(`.${s.foot}`,{autoAlpha:1,duration:.02},.98);
      return()=>{delete el.dataset.plotter;};
    });
    return()=>mm.revert();
  },{scope:root});
  return <section id="skills" ref={root} className={s.section} aria-labelledby="stack-heading"><div className={s.stage}><div className={`${s.wrap} max-w-6xl mx-auto px-8 md:px-16`}>
    <p className={s.eyebrow}>THE TOOLS / ONE CONNECTED SYSTEM</p><div className={s.headingRow}><h2 id="stack-heading" className={s.heading}>THE STACK<br/>BEHIND THE WORK<span className={s.anchor} aria-hidden="true"><span className={s.staticPeriod}>.</span><span className={s.splash}>{Array.from({length:6},(_,i)=><i key={i}/>)}</span></span></h2></div><p className={s.subtitle}>One request travels through an interface, an API, and data.</p>
    <div className={s.diagram}><svg className={s.graph} viewBox="0 0 1000 240" preserveAspectRatio="none" aria-hidden="true"><path className={s.bus} d="M 166 20 H 834"/><path className={s.stem} d="M166 20V240"/><path className={s.stem} d="M500 20V240"/><path className={s.stem} d="M834 20V240"/></svg><div className={s.nodes}>{nodes.map((node,i)=><div className={s.lane} key={node.name}><div className={s.node}><svg className={s.nodeFrame} viewBox="0 0 240 100" preserveAspectRatio="none" aria-hidden="true"><rect x=".5" y=".5" width="239" height="99" rx="16"/></svg><span className={s.icon}><Icon index={i}/></span><span className={s.nodeLabel}>{node.name}</span></div><ul>{node.items.map(item=><li className={s.item} key={item}>{item}</li>)}</ul></div>)}</div></div>
    <div className={s.foot}><button type="button" aria-expanded={more} onClick={()=>setMore(!more)}>{more?"− Fewer tools":"+ More tools"}</button><a href="#experience">Follow the request ↘</a></div>
    </div><span className={s.dot} aria-hidden="true"/></div>{more&&<ul className={s.more}>{moreTools.map(tool=><li key={tool}>{tool}</li>)}</ul>}</section>;
}


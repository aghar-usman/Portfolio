"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SiJavascript, SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiPython, SiFlask, SiFastapi, SiPostgresql, SiMysql, SiDocker, SiGit, SiPandas, SiNumpy, SiLinux, SiSqlite } from "react-icons/si";
import s from "./StackPlotter.module.css";

gsap.registerPlugin(ScrollTrigger,useGSAP);
const skills=[
  {name:"JavaScript",icon:SiJavascript,color:"#e2b321"},{name:"React",icon:SiReact,color:"#087ea4"},{name:"Next.js",icon:SiNextdotjs,color:"var(--ink)"},{name:"TypeScript",icon:SiTypescript,color:"#3178c6"},
  {name:"Tailwind CSS",icon:SiTailwindcss,color:"#0891b2"},{name:"Python",icon:SiPython,color:"#3776ab"},{name:"Flask",icon:SiFlask,color:"var(--ink)"},{name:"FastAPI",icon:SiFastapi,color:"#009688"},
  {name:"PostgreSQL",icon:SiPostgresql,color:"#4169a1"},{name:"MySQL",icon:SiMysql,color:"#4479a1"},{name:"SQLite",icon:SiSqlite,color:"#1680ad"},{name:"Docker",icon:SiDocker,color:"#2496ed"},
  {name:"Git",icon:SiGit,color:"#f05032"},{name:"Pandas",icon:SiPandas,color:"#7665ae"},{name:"NumPy",icon:SiNumpy,color:"#4dabcf"},{name:"Linux",icon:SiLinux,color:"var(--ink)"}
];
const offsets=[[-.04,.03,-8],[.02,-.04,7],[-.015,.02,-5],[.025,-.03,9],[.02,.025,5],[-.035,-.025,-8],[.035,.035,7],[-.025,.01,-6],[-.03,-.01,-5],[.025,.04,9],[-.025,-.025,-7],[.02,.04,6],[.035,.01,8],[-.025,-.025,-5],[.02,.02,6],[-.02,-.02,-8]];
const moreTools=["MSSQL","SQL","REST APIs","ETL pipelines","LLM integration","Text-to-SQL","Prompt engineering","Ollama","Llama 3","Mistral","Claude","HuggingFace","TensorFlow","PyTorch","OpenCV","HTML5","CSS3","GCP","CI/CD","Vercel","Motion","GSAP"];

export default function StackPlotter(){
  const root=useRef<HTMLElement>(null);
  const timeline=useRef<gsap.core.Timeline|null>(null);
  const [more,setMore]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [canReplay,setCanReplay]=useState(false);
  useEffect(()=>{ScrollTrigger.refresh();},[more]);
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add("(min-width: 900px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)",()=>{
      const el=root.current!, stage=el.querySelector<HTMLElement>(`.${s.stage}`)!, heading=el.querySelector<HTMLElement>(`.${s.heading}`)!, anchor=el.querySelector<HTMLElement>(`.${s.anchor}`)!,dot=el.querySelector<HTMLElement>(`.${s.dot}`)!;
      const tiles=Array.from(el.querySelectorAll<HTMLElement>(`.${s.tile}`));
      const point=(target:Element,x=.5,y=.5)=>{const a=target.getBoundingClientRect(),b=stage.getBoundingClientRect();return{x:a.left-b.left+a.width*x-7,y:a.top-b.top+a.height*y-7};};
      const initial=point(heading,0,.7),landing=point(anchor);
      const scatter=tiles.map((tile,i)=>{const [dx,dy,rotation]=offsets[i];const board=el.querySelector<HTMLElement>(`.${s.board}`)!;return{x:dx*board.clientWidth,y:dy*board.clientHeight,rotation};});
      const positions=tiles.map((tile,i)=>{const p=point(tile);return{x:p.x+scatter[i].x,y:p.y+scatter[i].y};});
      el.dataset.plotter="active";
      const path=el.querySelector<SVGPathElement>(`.${s.trail}`)!;
      const svg=el.querySelector<SVGSVGElement>(`.${s.trailSvg}`)!;
      svg.setAttribute("viewBox",`0 0 ${stage.clientWidth} ${stage.clientHeight}`);
      path.setAttribute("d",positions.map((p,i)=>`${i?"L":"M"}${p.x+7},${p.y+7}`).join(" "));
      const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
      tiles.forEach((tile,i)=>{gsap.set(tile,{...scatter[i],autoAlpha:0});const outline=tile.querySelector<SVGRectElement>("rect")!;const len=outline.getTotalLength();gsap.set(outline,{strokeDasharray:len,strokeDashoffset:len});});
      gsap.set(dot,{...initial,scale:0});gsap.set(heading,{clipPath:"inset(0 100% 0 0)"});gsap.set(`.${s.subtitle}, .${s.skillIcon}, .${s.skillName}`,{autoAlpha:0});gsap.set(`.${s.splash} i`,{opacity:0,scale:0});
      const tl=gsap.timeline({paused:true,onStart:()=>{setPlaying(true);setCanReplay(true);},onComplete:()=>{gsap.set(dot,point(anchor));setPlaying(false);}});timeline.current=tl;
      tl.to(dot,{scale:1,duration:.22,ease:"back.out(2.5)"})
        .to(dot,{x:landing.x,y:initial.y,duration:.85,ease:"power1.inOut"},.15)
        .to(heading,{clipPath:"inset(0 0% 0 0)",duration:.85,ease:"power1.inOut"},.15)
        .to(`.${s.subtitle}`,{autoAlpha:1,duration:.35},.75)
        .to(path,{strokeDashoffset:0,duration:3.25,ease:"none"},1.15);
      tiles.forEach((tile,i)=>{const at=1.15+i*.19;
        tl.to(dot,{...positions[i],duration:.19,ease:"power1.inOut"},at)
          .to(tile,{autoAlpha:1,duration:.08},at+.10)
          .to(tile.querySelector("rect"),{strokeDashoffset:0,duration:.24,ease:"none"},at+.10)
          .to(tile.querySelectorAll(`.${s.skillIcon}, .${s.skillName}`),{autoAlpha:1,duration:.2},at+.18);
      });
      tl.to(path,{autoAlpha:0,duration:.5},4.5)
        .to(tiles,{x:0,y:0,rotation:0,duration:1.05,stagger:{amount:.22},ease:"power3.inOut"},4.5)
        .to(dot,{x:()=>point(anchor).x,duration:.9,ease:"power2.inOut"},5.8)
        .to(dot,{y:()=>point(anchor).y-120,duration:.42,ease:"power2.out"},5.8)
        .to(dot,{y:()=>point(anchor).y,duration:.48,ease:"bounce.out"},6.22)
        .to(dot,{scaleX:1.25,scaleY:.8,duration:.065,repeat:1,yoyo:true},6.7)
        .to(`.${s.splash} i`,{opacity:1,scale:1,duration:.03},6.68)
        .to(`.${s.splash} i`,{x:(i)=>Math.cos(i*Math.PI/3)*28,y:(i)=>Math.sin(i*Math.PI/3)*23,opacity:0,duration:.35},6.71);
      ScrollTrigger.create({trigger:el,start:"top 65%",once:true,onEnter:()=>tl.play()});
      const finish=ScrollTrigger.create({trigger:el,start:"bottom top",onEnter:()=>{if(tl.isActive())tl.progress(1);}});
      return()=>{finish.kill();timeline.current=null;delete el.dataset.plotter;};
    });
    return()=>mm.revert();
  },{scope:root});
  return <section id="skills" ref={root} className={s.section} aria-labelledby="stack-heading"><div className={s.stage}><div className={`${s.wrap} max-w-6xl mx-auto px-8 md:px-16`}>
    <p className={s.eyebrow}>TOOLS BEHIND THE WORK <span>FROM A LITTLE CHAOS TO A CLEAR SYSTEM</span></p><h2 id="stack-heading" className={s.heading}>The stack behind the work<span className={s.anchor} aria-hidden="true"><span className={s.staticPeriod}>.</span><span className={s.splash}>{Array.from({length:6},(_,i)=><i key={i}/>)}</span></span></h2><p className={s.subtitle}>One request travels through an interface, an API, and data.</p>
    <div className={s.board}><ul className={s.grid}>{skills.map(skill=><li className={s.tile} key={skill.name}><svg className={s.outline} viewBox="0 0 220 70" preserveAspectRatio="none" aria-hidden="true"><rect x=".5" y=".5" width="219" height="69" rx="11"/></svg><span className={s.skillIcon} style={{"--skill-color":skill.color} as CSSProperties}><skill.icon aria-hidden="true"/></span><span className={s.skillName}>{skill.name}</span></li>)}</ul></div>
    <div className={s.foot}><button type="button" aria-expanded={more} onClick={()=>setMore(!more)}>{more?"− Fewer tools":"+ More tools"}</button>{canReplay&&<button className={s.replay} type="button" disabled={playing} onClick={()=>timeline.current?.restart()}>{playing?"Drawing the stack…":"↻ Replay drawing"}</button>}<a href="#experience">Follow the request ↘</a></div><p className={s.credit}>Technology marks: <a href="https://simpleicons.org/" target="_blank" rel="noreferrer">Simple Icons</a>.</p>
    </div><svg className={s.trailSvg} aria-hidden="true"><path className={s.trail}/></svg><span className={s.dot} aria-hidden="true"/></div>{more&&<ul className={s.more}>{moreTools.map(tool=><li key={tool}>{tool}</li>)}</ul>}</section>;
}

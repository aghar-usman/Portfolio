"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SiJavascript, SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiPython, SiFlask, SiFastapi, SiPostgresql, SiMysql, SiDocker, SiGit, SiPandas, SiNumpy, SiLinux } from "react-icons/si";
import { RiOpenaiFill } from "react-icons/ri";
import s from "./StackPlotter.module.css";

gsap.registerPlugin(ScrollTrigger,useGSAP);
const skills=[
  {name:"JavaScript",icon:SiJavascript,color:"#e2b321"},{name:"React",icon:SiReact,color:"#087ea4"},{name:"Next.js",icon:SiNextdotjs,color:"var(--ink)"},{name:"TypeScript",icon:SiTypescript,color:"#3178c6"},
  {name:"Tailwind CSS",icon:SiTailwindcss,color:"#0891b2"},{name:"Python",icon:SiPython,color:"#3776ab"},{name:"Flask",icon:SiFlask,color:"var(--ink)"},{name:"FastAPI",icon:SiFastapi,color:"#009688"},
  {name:"PostgreSQL",icon:SiPostgresql,color:"#4169a1"},{name:"MySQL",icon:SiMysql,color:"#4479a1"},{name:"Git",icon:SiGit,color:"#f05032"},{name:"Docker",icon:SiDocker,color:"#2496ed"},
  {name:"Pandas",icon:SiPandas,color:"#7665ae"},{name:"NumPy",icon:SiNumpy,color:"#4dabcf"},{name:"Linux",icon:SiLinux,color:"var(--ink)"},{name:"Codex",icon:RiOpenaiFill,color:"var(--ink)"}
];
const offsets=[[-.04,.03,-8],[.02,-.04,7],[-.015,.02,-5],[.025,-.03,9],[.02,.025,5],[-.035,-.025,-8],[.035,.035,7],[-.025,.01,-6],[-.03,-.01,-5],[.025,.04,9],[-.025,-.025,-7],[.02,.04,6],[.035,.01,8],[-.025,-.025,-5],[.02,.02,6],[-.02,-.02,-8]];
const moreTools=["SQLite","MSSQL","SQL","REST APIs","ETL pipelines","LLM integration","Text-to-SQL","Prompt engineering","Ollama","Llama 3","Mistral","Claude","HuggingFace","TensorFlow","PyTorch","OpenCV","HTML5","CSS3","GCP","CI/CD","Vercel","Motion","GSAP"];

export default function StackPlotter(){
  const root=useRef<HTMLElement>(null);
  const timeline=useRef<gsap.core.Timeline|null>(null);
  const [more,setMore]=useState(false);
  const [playing,setPlaying]=useState(false);
  const [canReplay,setCanReplay]=useState(false);
  const [layoutVersion,setLayoutVersion]=useState(0);
  useEffect(()=>{
    let alive=true;
    let timer:ReturnType<typeof setTimeout>;
    let width=window.innerWidth,height=window.innerHeight;
    const refresh=()=>{clearTimeout(timer);timer=setTimeout(()=>{if(alive)setLayoutVersion(value=>value+1);},180);};
    const resize=()=>{const nextWidth=window.innerWidth,nextHeight=window.innerHeight;if(nextWidth===width&&(nextWidth<900||Math.abs(nextHeight-height)<80))return;width=nextWidth;height=nextHeight;refresh();};
    window.addEventListener("resize",resize);
    void document.fonts.ready.then(refresh);
    return()=>{alive=false;clearTimeout(timer);window.removeEventListener("resize",resize);};
  },[]);
  useEffect(()=>{ScrollTrigger.refresh();},[more]);
  useGSAP(()=>{
    const mm=gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)",()=>{
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
        .to(path,{strokeDashoffset:0,duration:13.12,ease:"none"},1.4);
      tiles.forEach((tile,i)=>{const at=1.4+i*.82;
        tl.to(dot,{...positions[i],duration:.55,ease:"power1.inOut"},at)
          .to(tile,{autoAlpha:1,duration:.15},at+.15)
          .to(tile.querySelector("rect"),{strokeDashoffset:0,duration:.55,ease:"none"},at+.15)
          .to(tile.querySelectorAll(`.${s.skillIcon}, .${s.skillName}`),{autoAlpha:1,duration:.3},at+.45);
      });
      tl.to(path,{autoAlpha:0,duration:.5},14.6)
        .to(tiles,{x:0,y:0,rotation:0,duration:1.4,stagger:{amount:.2},ease:"power3.inOut"},14.6)
        .to(dot,{x:()=>point(anchor).x,duration:1.5,ease:"power2.inOut"},16.4)
        .to(dot,{y:()=>point(anchor).y-120,duration:.7,ease:"power2.out"},16.4)
        .to(dot,{y:()=>point(anchor).y,duration:.8,ease:"bounce.out"},17.1)
        .to(dot,{scaleX:1.25,scaleY:.8,duration:.065,repeat:1,yoyo:true},17.9)
        .to(`.${s.splash} i`,{opacity:1,scale:1,duration:.03},17.88)
        .to(`.${s.splash} i`,{x:(i)=>Math.cos(i*Math.PI/3)*28,y:(i)=>Math.sin(i*Math.PI/3)*23,opacity:0,duration:.35},17.91)
        .to(dot,{scale:1,duration:.74},18.26);
      const trigger=ScrollTrigger.create({trigger:el,start:"top 70%",end:"bottom 10%",onEnter:()=>{if(tl.progress()<1)tl.play();},onEnterBack:()=>{if(tl.progress()<1)tl.resume();},onRefresh:self=>{if(self.isActive&&tl.progress()<1)tl.play();},onLeave:()=>tl.pause(),onLeaveBack:()=>tl.pause()});
      if(trigger.isActive)tl.play();
      return()=>{timeline.current=null;delete el.dataset.plotter;};
    });
    return()=>mm.revert();
  },{scope:root,dependencies:[layoutVersion],revertOnUpdate:true});
  return <section id="skills" ref={root} className={s.section} aria-labelledby="stack-heading"><div className={s.stage}><div className={`${s.wrap} max-w-6xl mx-auto px-8 md:px-16`}>
    <p className={s.eyebrow}>TOOLS BEHIND THE WORK <span>FROM A LITTLE CHAOS TO A CLEAR SYSTEM</span></p><h2 id="stack-heading" className={s.heading}>The stack behind the work<span className={s.anchor} aria-hidden="true"><span className={s.staticPeriod}>.</span><span className={s.splash}>{Array.from({length:6},(_,i)=><i key={i}/>)}</span></span></h2><p className={s.subtitle}>One request travels through an interface, an API, and data.</p>
    <div className={s.board}><ul className={s.grid}>{skills.map(skill=><li className={s.tile} key={skill.name}><svg className={s.outline} viewBox="0 0 220 70" preserveAspectRatio="none" aria-hidden="true"><rect x=".5" y=".5" width="219" height="69" rx="11"/></svg><span className={s.skillIcon} style={{"--skill-color":skill.color} as CSSProperties}><skill.icon aria-hidden="true"/></span><span className={s.skillName}>{skill.name}</span></li>)}</ul></div>
    <div className={s.foot}><button type="button" aria-expanded={more} onClick={()=>setMore(!more)}>{more?"− Fewer tools":"+ More tools"}</button>{canReplay&&<button className={s.replay} type="button" disabled={playing} onClick={()=>timeline.current?.restart()}>{playing?"Drawing the stack…":"↻ Replay drawing"}</button>}<a href="#experience">Follow the request ↘</a></div><p className={s.credit}>Technology marks: <a href="https://simpleicons.org/" target="_blank" rel="noreferrer">Simple Icons</a> and <a href="https://remixicon.com/" target="_blank" rel="noreferrer">Remix Icon</a>.</p>
    </div><svg className={s.trailSvg} aria-hidden="true"><path className={s.trail}/></svg><span className={s.dot} aria-hidden="true"/></div>{more&&<ul className={s.more}>{moreTools.map(tool=><li key={tool}>{tool}</li>)}</ul>}</section>;
}

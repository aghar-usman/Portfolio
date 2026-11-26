"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Link001 } from "./ui/skiper-ui/skiper40";
import { ArrowUpRight, ArrowDown, Circle } from "lucide-react";
import { projects } from "@/data";
import s from "./SelectedWork.module.css";

export default function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    let alive = true;
    let revert = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive || !root.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el=root.current!;
        el.dataset.tear="active";
        const backdrop=el.querySelector<HTMLElement>(`.${s.backdrop}`)!;
        backdrop.inert=true;
        const timeline=gsap.timeline({scrollTrigger:{trigger:el.querySelector(`.${s.runway}`),start:"top top",end:"bottom bottom",scrub:1,snap:{snapTo:[0,1],duration:{min:.15,max:.35},delay:.15},invalidateOnRefresh:true,onUpdate:self=>{backdrop.inert=self.progress<.85;}}});
        timeline.to(el.querySelector(`.${s.upper}`),{yPercent:-105,ease:"none",duration:1},0)
          .to(el.querySelector(`.${s.lower}`),{yPercent:105,ease:"none",duration:1},0)
          .fromTo(el.querySelector(`.${s.featured}`),{scale:.97},{scale:1,ease:"none",duration:1},0)
          .fromTo(el.querySelectorAll(`.${s.paper}`),{filter:"drop-shadow(0 2px 3px #0003)"},{filter:"drop-shadow(0 24px 18px #0008)",ease:"none",duration:1},0);
        return ()=>{delete el.dataset.tear;backdrop.inert=false;};
      });
      revert=()=>mm.revert();
      document.fonts.ready.then(()=>{if(alive)ScrollTrigger.refresh();});
    });
    return ()=>{alive=false;revert();};
  },[]);
  const featured=projects[0];
  return <section id="projects" ref={root} className={s.work} aria-labelledby="work-title">
    <div className={s.runway}><div className={s.stage}>
      <div className={s.backdrop}><div className={s.frameHeader}><h2 id="work-title">Selected work<span>.</span></h2><span>01 — 03 / Built & shipped</span></div>
        <article className={s.featured} aria-labelledby="featured-title"><div className={s.projectInfo}><p className={s.status}><Circle size={8} fill="currentColor"/> Live website</p><span className={s.index}>01</span><h3 id="featured-title">{featured.name}</h3><p>{featured.tagline}</p><ul className={s.tags}>{featured.stack.map(tool=><li key={tool}>{tool}</li>)}</ul><Link001 className={s.liveLink} href={featured.live!} target="_blank" rel="noreferrer">View live website</Link001><details className={s.details}><summary>How I built it</summary><ul>{featured.points.map(point=><li key={point}>{point}</li>)}</ul></details></div><a className={s.browser} href={featured.live} target="_blank" rel="noreferrer" aria-label="Visit SU·EN Studio website"><div className={s.browserBar}><span className={s.traffic}><i/><i/><i/></span><span>suen-studio.vercel.app</span><ArrowUpRight size={14}/></div><div className={s.screen}><Image src="/suen-studio-preview.jpg" alt="The SU·EN Studio architecture portfolio website" width={1600} height={1000} sizes="(max-width: 899px) 90vw, 65vw"/></div></a></article>
      </div>
      <div className={`${s.paper} ${s.upper}`} aria-hidden="true"><div className={s.paperContent}><span className={s.chapter}>01 / PROJECTS & EXPERIMENTS</span><span className={s.giant}>SELECTED<br/>WORK</span><span className={s.tearHint}>Keep scrolling to unfold <ArrowDown size={16}/></span></div></div>
      <div className={`${s.paper} ${s.lower}`} aria-hidden="true"><div className={s.paperContent}><span className={s.chapter}>01 / PROJECTS & EXPERIMENTS</span><span className={s.giant}>SELECTED<br/>WORK</span><span className={s.tearHint}>Keep scrolling to unfold <ArrowDown size={16}/></span></div></div>
    </div></div>
    <div className={s.mobileDetails}><ul className={s.tags}>{featured.stack.map(tool=><li key={tool}>{tool}</li>)}</ul><details className={s.details}><summary>How I built SU·EN Studio</summary><ul>{featured.points.map(point=><li key={point}>{point}</li>)}</ul></details></div>
    <div className={s.moreWork}>{projects.slice(1).map((project,i)=><article className={s.secondary} key={project.name}><span className={s.smallIndex}>0{i+2}</span><div><span className={s.year}>{project.period}</span><h3>{project.name}</h3><p>{project.tagline}</p>{project.currentPage&&<p className={s.current}>You are viewing this page.</p>}<ul className={s.tags}>{project.stack.map(tool=><li key={tool}>{tool}</li>)}</ul><details className={s.details}><summary>How I built it</summary><ul>{project.points.map(point=><li key={point}>{point}</li>)}</ul></details></div><Link001 className={s.source} href={project.github!} target="_blank" rel="noreferrer" aria-label={`View ${project.name} on GitHub`}>GitHub</Link001></article>)}</div>
  </section>;
}

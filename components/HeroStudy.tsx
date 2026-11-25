"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sun, Moon, Code2, Menu, X, Check } from "lucide-react";
import s from "./HeroStudy.module.css";
import { profile } from "@/data";

export default function HeroStudy({ embedded = false }: { embedded?: boolean }) {
  const [dark,setDark]=useState(false);
  const [menu,setMenu]=useState(false);
  const [wink,setWink]=useState(false);
  const stage=useRef<HTMLDivElement>(null);
  useEffect(() => { if (!embedded) return; const id = window.setTimeout(() => setDark(document.documentElement.dataset.theme === "night"), 0); return () => clearTimeout(id); }, [embedded]);
  const toggleTheme = () => { const next = !dark; setDark(next); if (embedded) { document.documentElement.dataset.theme = next ? "night" : "light"; localStorage.setItem("portfolio-theme", next ? "night" : "light"); } };
  return <div className={`${s.page} ${embedded?s.embedded:""}`} data-preview-theme={dark?"dark":"light"}>
    <div className={s.sheet} ref={stage} onPointerMove={e=>{if(e.pointerType!=="mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches)return;const r=e.currentTarget.getBoundingClientRect();stage.current?.style.setProperty("--mx",`${((e.clientX-r.left)/r.width-.5)*12}px`);stage.current?.style.setProperty("--my",`${((e.clientY-r.top)/r.height-.5)*7}px`);}} onPointerLeave={()=>{stage.current?.style.setProperty("--mx","0px");stage.current?.style.setProperty("--my","0px");}}>
      <header className={s.header}><Link className={s.logo} href={embedded?"#about":"/hero-preview"} aria-label="AUKT home">AUKT.</Link><nav className={`${s.nav} ${menu?s.open:""}`} aria-label="Portfolio">{[{id:"projects",label:"Work"},{id:"experience",label:"Experience"},{id:"education",label:"Education"},{id:"contact",label:"Contact"}].map(item=><Link key={item.id} href={`/#${item.id}`} onClick={()=>setMenu(false)}>{item.label}</Link>)}</nav><div className={s.controls}><Link href="/resume.pdf" className={`${s.circle} ${s.amber}`} aria-label="View resume"><Code2 size={19}/></Link><button className={`${s.circle} ${s.blue}`} onClick={toggleTheme} aria-label={`Preview ${dark?"light":"dark"} mode`}>{dark?<Sun size={19}/>:<Moon size={19}/>}</button><button className={`${s.circle} ${s.menu}`} aria-label="Toggle navigation" aria-expanded={menu} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></header>
      <section className={s.hero} id="about"><div className={s.holes} aria-hidden="true">{Array.from({length:7},(_,i)=><i key={i}/>)}</div><div className={s.title} aria-hidden="true">AUKT</div><span className={`${s.sticker} ${s.developer}`}>FULL-STACK DEVELOPER</span><span className={`${s.sticker} ${s.interface}`}>UI ↔ API</span>
        <div className={s.copy}><p className={s.availability}><i/> Open to full-stack roles</p><h1>Building digital<br/>experiences with<br/><em>personality.</em></h1><p className={s.description}>{profile.intro}</p><div className={s.actions}><Link href="mailto:agharusman529@gmail.com" className={s.primary}><ArrowRight size={22}/> Let’s talk</Link><Link href="/#projects" className={s.secondary}>View work <ArrowUpRight size={19}/></Link></div><p className={s.location}>BASED IN KERALA, INDIA <span>↗</span></p></div>
        <button className={`${s.portrait} ${wink?s.nod:""}`} onClick={()=>{setWink(true);window.setTimeout(()=>setWink(false),650);}} aria-label="Say hello to Aghar"><Image className={s.lightPortrait} src="/portraits/light-cutout.png" alt="Illustrated portrait of Aghar in a striped knit polo" width={1122} height={1402} priority/><Image className={s.darkPortrait} src="/portraits/dark-cutout.png" alt="" width={1122} height={1402} priority/></button>
        <aside className={s.notes}><div className={s.checklist}><span className={s.tape}/><p><Check size={20}/> Design with care</p><p><Check size={20}/> Build with intent</p><p><Check size={20}/> Keep improving</p></div><div className={s.proof}><div><strong>UI</strong><span>what you see</span></div><i/><div><strong>API</strong><span>what connects</span></div></div><Link className={s.workCard} href="/#projects"><span className={s.tape}/><div className={s.browserDots}>● ● ●</div><Image src="/suen-studio-preview.jpg" alt="SU·EN Studio website project" width={600} height={375}/><span>Things I’ve built <ArrowUpRight size={16}/></span></Link></aside>
        <span className={`${s.doodle} ${s.doodleOne}`} aria-hidden="true">✳</span><span className={`${s.doodle} ${s.doodleTwo}`} aria-hidden="true">↙</span><Link className={s.github} href="https://github.com/aghar-usman" target="_blank" rel="noreferrer"><Code2 size={15}/> Find me on GitHub <ArrowUpRight size={14}/></Link>
      </section>
    </div>{!embedded && <p className={s.previewNote}>HERO STUDY 01 <span>Local preview · {dark?"Dark":"Light"} palette</span></p>}
  </div>;
}

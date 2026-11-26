"use client";
import Image from "next/image";
import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, Download, Plus, Trophy } from "lucide-react";
import { achievements, contact, education, languages } from "@/data";
import { AnimatedNumber } from "./ui/skiper-ui/skiper37";
import { Magnetic } from "./ui/skiper-ui/skiper61";
import { Link001, Link002 } from "./ui/skiper-ui/skiper40";
import s from "./EducationContact.module.css";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

export default function EducationContact(){
  const [open,setOpen]=useState(false);
  const [copyState,setCopyState]=useState<"idle"|"copied"|"failed">("idle");
  const panelId=useId(),buttonId=useId();
  const reduce=useReducedMotion();
  async function copyEmail(){try{await navigator.clipboard.writeText(contact.email);setCopyState("copied");}catch{setCopyState("failed");}}
  return <>
    <section id="education" className={s.education} aria-labelledby="education-title"><div className={s.wrap}>
      <div className={s.sectionHead}><h2 id="education-title">The foundation.</h2><p>Education, curiosity,<br/>and learning by building.</p></div>
      <div className={s.record}>
        <div className={s.recordTop}><span>Education / 2021—2025</span><span>Hassan, Karnataka</span></div>
        <div className={s.academic}>
          <div className={s.crest}><Image src="/college-crest.png" alt="Malnad College of Engineering crest" width={343} height={384} sizes="(max-width: 600px) 105px, 150px" /></div>
          <div className={s.college}><h3>{education.school}</h3><p>{education.degree}</p><span>{education.period}</span></div>
          <div className={s.grade}><span>CGPA / 10</span><strong><AnimatedNumber value={7.81} decimals={2}/></strong><p>First Class<br/>with Distinction</p></div>
        </div>
        {/* Adapted from Unlumen's free Motion FAQs Accordion: semantic trigger,
            spring height reveal, portfolio styling, and a reduced-motion path. */}
        <div className={s.coursework}>
          <button id={buttonId} type="button" aria-expanded={open} aria-controls={panelId} onClick={()=>setOpen(!open)}><span>What I studied <small>{education.coursework.length} subjects</small></span><motion.span aria-hidden="true" animate={{rotate:open?45:0}} transition={{duration:reduce?0:.25}}><Plus size={22}/></motion.span></button>
          <motion.div id={panelId} role="region" aria-labelledby={buttonId} aria-hidden={!open} inert={!open} initial={false} animate={{height:open?"auto":0,opacity:open?1:0}} transition={reduce?{duration:0}:{type:"spring",stiffness:340,damping:34,mass:.9}} className={s.coursePanel}><ul>{education.coursework.map(c=><li key={c}>{c}</li>)}</ul></motion.div>
        </div>
      </div>
      <div className={s.beyond}><div className={s.achievement}><Trophy size={25} aria-hidden="true"/><div><h3>Built under pressure.</h3><p>{achievements[0]}</p></div></div><div className={s.languages}><span>Languages I speak</span><p>{languages.map(l=>l.name).join(" · ")}</p></div></div>
    </div></section>
    <section id="contact" className={s.contact} aria-labelledby="contact-title"><div className={s.wrap}>
      <div className={s.contactTop}><p><span aria-hidden="true"/> Open to full-stack roles</p><span>Based in Kerala, India</span></div>
      <div className={s.invitation}><h2 id="contact-title">Let’s turn<br/><span className={s.headlinePhrase}><em>what if</em>{" "}<span>into</span>{" "}<em>live.</em></span></h2><Magnetic className={s.magnet}><a href={`mailto:${contact.email}`} className={s.mailButton}><ArrowUpRight size={48} aria-hidden="true"/><span>Send an email</span></a></Magnetic></div>
      <p className={s.contactIntro}>Email me about a full-stack role or a website you’re building.</p>
      <div className={s.emailRow}><Link002 href={`mailto:${contact.email}`} className={s.email}>{contact.email}</Link002><button type="button" className={s.copy} onClick={copyEmail}>{copyState==="copied"?<Check size={17} aria-hidden="true"/>:<Copy size={17} aria-hidden="true"/>}{copyState==="copied"?"Copied":"Copy email"}</button></div>
      <p role="status" className={s.copyStatus}>{copyState==="copied"?"Email address copied to clipboard.":copyState==="failed"?"Copy unavailable. Use the email link to get in touch.":""}</p>
      <div className={s.contactFoot}><div className={s.socials}><Link001 href={contact.linkedin} target="_blank"><FaLinkedinIn aria-hidden="true"/>LinkedIn</Link001><Link001 href={contact.github} target="_blank"><FaGithub aria-hidden="true"/>GitHub</Link001></div><a href={contact.resume} download className={s.resume}><Download size={17} aria-hidden="true"/> Download resume</a><a href="#about" className={s.back}>Back to top <ArrowUpRight size={16} aria-hidden="true"/></a></div>
      <footer className={s.footer}><span>© {new Date().getFullYear()} AUKT.</span><span><a href="https://skiper-ui.com" target="_blank" rel="noopener noreferrer">Skiper UI</a></span></footer>
    </div></section>
  </>;
}

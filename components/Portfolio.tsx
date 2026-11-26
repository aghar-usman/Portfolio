"use client";

import { useEffect, useState } from "react";
import SelectedWork from "./SelectedWork";
import StackPlotter from "./StackPlotter";
import HeroStudy from "./HeroStudy";
import ExperienceLab from "./ExperienceLab";
import { achievements, contact, education, languages } from "@/data";

export default function Portfolio() {

  const [reduced, setReduced] = useState(false);
  useEffect(() => { const media = matchMedia("(prefers-reduced-motion: reduce)"); const update = () => setReduced(media.matches); const id = window.setTimeout(update, 0); media.addEventListener("change", update); return () => { clearTimeout(id); media.removeEventListener("change", update); }; }, []);
  useEffect(() => {
    if (reduced || matchMedia("(max-width: 899px), (prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let dispose = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {




        gsap.fromTo(".contact h2", { scale: .92, opacity: .45 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: "#contact", start: "top 85%", end: "top 10%", scrub: true } });
      });
      dispose = () => ctx.revert();
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    });
    return () => { alive = false; dispose(); };
  }, [reduced]);


  return <>
    <a className="skip" href="#main">Skip to content</a>
    <main id="main">
      <HeroStudy embedded />
      <SelectedWork />
      <StackPlotter />
      <ExperienceLab />
      <section id="education" className="section education" aria-labelledby="education-title"><div className="wrap"><div className="section-head"><span className="eyebrow">04 / The foundation</span><h2 id="education-title">Education.</h2></div><div className="education-grid"><div><div className="college"><span className="college-mark" aria-hidden="true">MCE</span><div><h3>{education.school}</h3><p>{education.location} · {education.period}</p></div></div><p className="degree">{education.degree}</p><p>{education.detail}</p><div className="achievement"><span className="eyebrow">Achievement</span><p>{achievements[0]}</p></div><div className="languages"><span className="eyebrow">Languages</span><p>{languages.map(l => l.name).join(" · ")}</p></div></div><div className="coursework"><span className="eyebrow">Selected coursework</span><ul>{education.coursework.map(c => <li key={c}>{c}</li>)}</ul></div></div></div></section>
      <section id="contact" className="section contact" aria-labelledby="contact-title"><div className="wrap contact-inner"><span className="eyebrow">05 / 200 OK</span><p>Email me about a full-stack role or a website you’re building.</p><a className="email" href={`mailto:${contact.email}`}>{contact.email}</a><div className="actions"><a className="primary" href={`mailto:${contact.email}`}>Send an email ↗</a><a className="outline" href={contact.resume} download>Download resume ↓</a></div><h2 id="contact-title">LET’S<br />TALK</h2><div className="contact-links"><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a></div><p className="copyright">© {new Date().getFullYear()} Aghar Usman K T</p></div></section>
    </main>
  </>;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SelectedWork from "./SelectedWork";
import HeroStudy from "./HeroStudy";
import { achievements, contact, education, experience, languages, requestDemo } from "@/data";

const chapters = ["about", "skills", "experience", "projects", "education", "contact"] as const;
type Chapter = typeof chapters[number];
const tools = ["LLM integration", "Text-to-SQL", "Prompt engineering", "Ollama", "Llama 3", "Mistral", "Claude", "HuggingFace", "TensorFlow", "PyTorch", "OpenCV", "JavaScript", "HTML5", "CSS3", "MySQL", "SQLite", "Pandas", "NumPy", "Docker", "Git/GitHub", "Linux", "GCP", "CI/CD", "Vercel", "Motion", "GSAP"];

function Demo({ active, reduced }: { active: boolean; reduced: boolean }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const run = useCallback(() => {
    clear(); setStep(1); setRunning(true);
    if (reduced) { setStep(4); setRunning(false); return; }
    [[requestDemo.timing.queryStart, 2], [requestDemo.timing.resultStart, 3], [requestDemo.timing.blockStart, 4]].forEach(([delay, next]) => timers.current.push(window.setTimeout(() => setStep(next), delay)));
    timers.current.push(window.setTimeout(() => setRunning(false), requestDemo.timing.done));
  }, [reduced]);
  useEffect(() => { const id = window.setTimeout(() => { if (active) run(); else { clear(); setStep(4); setRunning(false); } }, 0); return () => { clearTimeout(id); clear(); }; }, [active, run]);
  return <div className="demo">
    <div className="demo-top"><span className="eyebrow">A request through three layers</span><span className="status" aria-live="polite">{step === 4 ? "blocked · SELECT only" : step >= 3 ? "results" : "POST /request"}</span></div>
    <div className="rail" aria-hidden="true"><span>UI</span><i /><span>API</span><i /><span>DATA</span><i /><span>TRY IT</span></div>
    <div className="demo-grid"><div><span className="eyebrow">01 / Question</span><p>{step >= 1 ? requestDemo.question : "Your question travels from the interface."}</p></div><div className="sql"><span>02 / Generated SQL</span><pre>{step >= 2 ? requestDemo.query : "SELECT …"}</pre></div></div>
    <div className="result"><span className="eyebrow">03 / Sample orders · fictional</span>{step >= 3 && <table><thead><tr><th>Order ID</th><th>Status</th></tr></thead><tbody>{requestDemo.rows.map(row => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td></tr>)}</tbody></table>}</div>
    <div className="demo-bottom"><button type="button" className="text-button" disabled={running} onClick={run}>Replay demo ↗</button><button type="button" className="outline small" onClick={() => { clear(); setStep(4); setRunning(false); }}>Try a delete request</button>{step === 4 && <span className="safe">SELECT only · delete blocked</span>}</div>
    <p className="sr-only" aria-live="polite">{step === 1 ? requestDemo.status.question : step === 2 ? requestDemo.status.query : step === 3 ? requestDemo.status.results : step === 4 ? requestDemo.status.blocked : requestDemo.status.idle}</p>
  </div>;
}

export default function Portfolio() {
  const [chapter, setChapter] = useState<Chapter>("about");
  const [reduced, setReduced] = useState(false);
  const [more, setMore] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => { setReduced(matchMedia("(prefers-reduced-motion: reduce)").matches); }, 0); const io = new IntersectionObserver(entries => { const best = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]; if (best) setChapter(best.target.id as Chapter); }, { rootMargin: "-25% 0px -35% 0px", threshold: [0, .1, .25, .5] }); chapters.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); }); return () => { clearTimeout(id); io.disconnect(); }; }, []);
  useEffect(() => {
    if (reduced || matchMedia("(max-width: 899px), (prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let dispose = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {

        gsap.fromTo(".stack-bar", { xPercent: -8, opacity: .25 }, { xPercent: 0, opacity: 1, stagger: .12, ease: "none", scrollTrigger: { trigger: "#skills", start: "top 85%", end: "top 30%", scrub: true } });
        gsap.fromTo(".demo", { xPercent: -8, opacity: .4 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: "#experience", start: "top 80%", end: "top 30%", scrub: true } });

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
      <section id="skills" className="section stack" aria-labelledby="stack-title"><div className="wrap"><div className="section-head"><span className="eyebrow">Tools behind the work</span><h2 id="stack-title">The stack behind the work.</h2><p>One request travels through an interface, an API, and data.</p></div><div className="stack-bars"><div className="stack-bar ui"><strong>▣ &nbsp; UI</strong><span>React</span><span>Next.js</span><span>TypeScript</span><span>Tailwind CSS</span></div><div className="stack-bar api"><strong>⚙ &nbsp; API</strong><span>Python</span><span>Flask</span><span>FastAPI</span><span>REST APIs</span></div><div className="stack-bar data"><strong>▤ &nbsp; DATA</strong><span>PostgreSQL</span><span>MSSQL</span><span>SQL</span><span>ETL pipelines</span></div></div><button className="text-button more-button" type="button" aria-expanded={more} onClick={() => setMore(!more)}>{more ? "− Fewer tools" : "+ More tools"}</button>{more && <ul className="tools">{tools.map(t => <li key={t}>{t}</li>)}</ul>}<div className="stack-foot"><span>UI</span><i /><span>API</span><i /><span>DATA</span><a href="#experience">Follow the request ↘</a></div></div></section>
      <section id="experience" className="section experience" aria-labelledby="experience-title"><div className="wrap"><div className="section-head"><span className="eyebrow">02 / From question to answer</span><h2 id="experience-title">A request, made visible.</h2></div><div className="experience-grid"><Demo active={chapter === "experience"} reduced={reduced} /><div className="experience-copy"><span className="eyebrow">Feb – May 2025 · Calicut, Kerala</span><h3>Intern<br />Team Thai</h3><p>Built an ERP assistant that turns plain-English questions into SQL Server queries with Llama 3 and Mistral.</p><p>Cut Flask API response time by about 35% through caching and batched record fetching.</p><p>Limited generated queries to SELECT statements and checked seven SQL injection patterns.</p><details><summary>More about the work</summary><p>{experience[0].points[3]}</p></details></div></div></div></section>
      <section id="education" className="section education" aria-labelledby="education-title"><div className="wrap"><div className="section-head"><span className="eyebrow">04 / The foundation</span><h2 id="education-title">Education.</h2></div><div className="education-grid"><div><div className="college"><span className="college-mark" aria-hidden="true">MCE</span><div><h3>{education.school}</h3><p>{education.location} · {education.period}</p></div></div><p className="degree">{education.degree}</p><p>{education.detail}</p><div className="achievement"><span className="eyebrow">Achievement</span><p>{achievements[0]}</p></div><div className="languages"><span className="eyebrow">Languages</span><p>{languages.map(l => l.name).join(" · ")}</p></div></div><div className="coursework"><span className="eyebrow">Selected coursework</span><ul>{education.coursework.map(c => <li key={c}>{c}</li>)}</ul></div></div></div></section>
      <section id="contact" className="section contact" aria-labelledby="contact-title"><div className="wrap contact-inner"><span className="eyebrow">05 / 200 OK</span><p>Email me about a full-stack role or a website you’re building.</p><a className="email" href={`mailto:${contact.email}`}>{contact.email}</a><div className="actions"><a className="primary" href={`mailto:${contact.email}`}>Send an email ↗</a><a className="outline" href={contact.resume} download>Download resume ↓</a></div><h2 id="contact-title">LET’S<br />TALK</h2><div className="contact-links"><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a></div><p className="copyright">© {new Date().getFullYear()} Aghar Usman K T</p></div></section>
    </main>
  </>;
}

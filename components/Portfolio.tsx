"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { achievements, contact, education, experience, languages, projects, requestDemo } from "@/data";

const chapters = ["about", "skills", "experience", "projects", "education", "contact"] as const;
type Chapter = typeof chapters[number];
type Clip = "wave-greet" | "idle-blink" | "look-left" | "look-right" | "think-focus" | "click-excited";
const tools = ["LLM integration", "Text-to-SQL", "Prompt engineering", "Ollama", "Llama 3", "Mistral", "Claude", "HuggingFace", "TensorFlow", "PyTorch", "OpenCV", "JavaScript", "HTML5", "CSS3", "MySQL", "SQLite", "Pandas", "NumPy", "Docker", "Git/GitHub", "Linux", "GCP", "CI/CD", "Vercel", "Motion", "GSAP"];

function Character({ chapter, reduced }: { chapter: Chapter; reduced: boolean }) {
  const active = chapter === "about" || chapter === "contact";
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const frame = useRef<number>(0);
  const lastClick = useRef(0);
  const direction = useRef("");
  const holder = useRef<HTMLButtonElement>(null);
  const [clip, setClip] = useState<Clip>("wave-greet");
  const play = useCallback((next: Clip) => {
    if (reduced) return;
    setClip(next);
    const el = video.current;
    if (el) { el.src = `/character/${next}.webm`; el.currentTime = 0; void el.play().catch(() => {}); }
  }, [reduced]);
  useEffect(() => { const id = window.setTimeout(() => play("wave-greet"), 0); return () => clearTimeout(id); }, [play]);
  useEffect(() => {
    if (reduced || !active) return;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      holder.current?.style.setProperty("--trace-x", `${(x - .5) * 22}px`);
      holder.current?.style.setProperty("--trace-y", `${(y - .5) * 14}px`);
      const next = x < .38 ? "left" : x > .62 ? "right" : "center";
      if (next !== direction.current && next !== "center" && Date.now() - lastClick.current > 3000) {
        direction.current = next;
        play(next === "left" ? "look-left" : "look-right");
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [active, play, reduced]);
  useEffect(() => {
    const v = video.current, c = canvas.current;
    if (!v || !c || !active) return;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let lastFrame = 0;
    const draw = (now = 0) => {
      if (!reduced && now - lastFrame < 1000 / 24) { frame.current = requestAnimationFrame(draw); return; }
      lastFrame = now;
      if (v.readyState >= 2) {
        ctx.drawImage(v, 0, 0, c.width, c.height);
        const image = ctx.getImageData(0, 0, c.width, c.height);
        const px = image.data;
        // The supplied VP9 files have opaque cream backdrops. Key the light,
        // low-chroma matte at display size so both site themes remain usable.
        const width = c.width, height = c.height, count = width * height;
        const br = px[0], bg = px[1], bb = px[2];
        const seen = new Uint8Array(count);
        const queue = new Int32Array(count);
        let head = 0, tail = 0;
        const nearMatte = (index: number) => {
          const i = index * 4;
          return Math.min(px[i], px[i + 1], px[i + 2]) > 145 &&
            Math.abs(px[i] - br) + Math.abs(px[i + 1] - bg) + Math.abs(px[i + 2] - bb) < 105;
        };
        const push = (index: number) => {
          if (seen[index] || !nearMatte(index)) return;
          seen[index] = 1; queue[tail++] = index;
        };
        for (let x = 0; x < width; x++) { push(x); push((height - 1) * width + x); }
        for (let y = 0; y < height; y++) { push(y * width); push(y * width + width - 1); }
        while (head < tail) {
          const index = queue[head++];
          px[index * 4 + 3] = 0;
          const x = index % width;
          if (x > 0) push(index - 1);
          if (x < width - 1) push(index + 1);
          if (index >= width) push(index - width);
          if (index < count - width) push(index + width);
        }
        ctx.putImageData(image, 0, 0);
      }
      if (!reduced) frame.current = requestAnimationFrame(draw);
    };
    const drawStill = () => draw();
    if (reduced) { v.addEventListener("loadeddata", drawStill); if (v.readyState >= 2) drawStill(); }
    else frame.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(frame.current); v.removeEventListener("loadeddata", drawStill); };
  }, [active, clip, reduced]);
  return <button ref={holder} className={`character character-${chapter}`} type="button" tabIndex={active ? 0 : -1} aria-hidden={!active} aria-label="Play character reaction" onFocus={() => play("think-focus")} onClick={() => { const now = Date.now(); if (now - lastClick.current < 1500) return; lastClick.current = now; play("click-excited"); }}>
    <video ref={video} src={`/character/${clip}.webm`} muted playsInline preload="auto" onEnded={() => { if (clip !== "idle-blink") play("idle-blink"); }} className="character-source" aria-hidden="true" />
    <canvas ref={canvas} width="480" height="270" aria-hidden="true" />
    <span className="character-fallback" aria-hidden="true">A</span>
  </button>;
}

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
  const [theme, setTheme] = useState("light");
  const [reduced, setReduced] = useState(false);
  const [menu, setMenu] = useState(false);
  const [more, setMore] = useState(false);
  useEffect(() => { const id = window.setTimeout(() => { setTheme(document.documentElement.dataset.theme || "light"); setReduced(document.documentElement.dataset.reduceMotion === "on" || matchMedia("(prefers-reduced-motion: reduce)").matches); }, 0); const io = new IntersectionObserver(entries => { const best = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0]; if (best) setChapter(best.target.id as Chapter); }, { rootMargin: "-25% 0px -35% 0px", threshold: [0, .1, .25, .5] }); chapters.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); }); return () => { clearTimeout(id); io.disconnect(); }; }, []);
  useEffect(() => {
    if (reduced || matchMedia("(max-width: 899px), (prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    let dispose = () => {};
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (!alive) return;
      gsap.registerPlugin(ScrollTrigger);
      const ctx = gsap.context(() => {
        gsap.to(".hero h1", { xPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: "#about", start: "top top", end: "bottom 55%", scrub: true } });
        gsap.fromTo(".stack-bar", { xPercent: -8, opacity: .25 }, { xPercent: 0, opacity: 1, stagger: .12, ease: "none", scrollTrigger: { trigger: "#skills", start: "top 85%", end: "top 30%", scrub: true } });
        ScrollTrigger.create({ trigger: "#skills", start: "top top", end: "+=60%", pin: true, pinSpacing: true });
        gsap.fromTo(".demo", { xPercent: -8, opacity: .4 }, { xPercent: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: "#experience", start: "top 80%", end: "top 30%", scrub: true } });
        gsap.fromTo(".project-card", { xPercent: 9, opacity: .3 }, { xPercent: 0, opacity: 1, stagger: .08, ease: "none", scrollTrigger: { trigger: "#projects", start: "top 80%", end: "top 25%", scrub: true } });
        gsap.fromTo(".contact h2", { scale: .92, opacity: .45 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: "#contact", start: "top 85%", end: "top 10%", scrub: true } });
      });
      dispose = () => ctx.revert();
      document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
    });
    return () => { alive = false; dispose(); };
  }, [reduced]);
  const toggleTheme = () => { const next = theme === "light" ? "night" : "light"; const apply = () => { document.documentElement.dataset.theme = next; localStorage.setItem("portfolio-theme", next); setTheme(next); }; if (!reduced && document.startViewTransition) document.startViewTransition(apply); else apply(); };
  const toggleMotion = () => { const next = !reduced; document.documentElement.dataset.reduceMotion = next ? "on" : "off"; localStorage.setItem("portfolio-reduce-motion", next ? "on" : "off"); setReduced(next); };
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="nav"><a href="#about" className="brand" aria-label="AUKT, Aghar Usman home">AUKT<span className="brand-dot">.</span></a><nav aria-label="Main navigation" className={menu ? "nav-open" : ""}>{chapters.slice(1).map(id => <a key={id} href={`#${id}`} onClick={() => setMenu(false)} aria-current={chapter === id ? "location" : undefined}>{id === "skills" ? "Stack" : id[0].toUpperCase() + id.slice(1)}</a>)}</nav><div className="nav-controls"><button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "night" : "light"} theme`} title="Toggle theme">{theme === "light" ? "◐" : "◑"}</button><button type="button" className="motion-switch" onClick={toggleMotion} aria-pressed={reduced}>{reduced ? "Motion off" : "Reduce motion"}</button><button type="button" className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-label="Toggle menu">{menu ? "×" : "☰"}</button></div></header>
    <main id="main">
      <section id="about" className="section hero" aria-labelledby="hero-title"><div className="wrap hero-inner"><div className="hero-copy"><span className="badge">● Open to full-stack roles</span><p className="handnote">Taught an ERP to understand plain English.</p><h1 id="hero-title"><span className="sr-only">Aghar Usman K T, full-stack developer</span><span aria-hidden="true"><small>HEY, I’M</small>AGHAR</span></h1><div className="hero-left"><p className="lead">React interfaces. Python APIs. SQL that answers back.</p><p className="body-copy">Full-stack developer from Kerala. At Team Thai, I built an ERP assistant that turns plain-English questions into SQL.</p></div><div className="hero-right"><div className="actions"><a className="primary" href="#projects">View projects ↗</a><a className="outline" href="#contact">Let’s talk ↗</a></div><div className="hero-pills" aria-label="Explore the stack"><a href="#skills">▣ UI</a><a href="#skills">⚙ API</a><a href="#skills">▤ Data</a></div></div></div><a className="scroll-cue" href="#skills">Scroll to explore ↓</a></div></section>
      <section id="skills" className="section stack" aria-labelledby="stack-title"><div className="wrap"><div className="section-head"><span className="eyebrow">01 / The layers</span><h2 id="stack-title">The stack behind the work.</h2><p>One request travels through an interface, an API, and data.</p></div><div className="stack-bars"><div className="stack-bar ui"><strong>▣ &nbsp; UI</strong><span>React</span><span>Next.js</span><span>TypeScript</span><span>Tailwind CSS</span></div><div className="stack-bar api"><strong>⚙ &nbsp; API</strong><span>Python</span><span>Flask</span><span>FastAPI</span><span>REST APIs</span></div><div className="stack-bar data"><strong>▤ &nbsp; DATA</strong><span>PostgreSQL</span><span>MSSQL</span><span>SQL</span><span>ETL pipelines</span></div></div><button className="text-button more-button" type="button" aria-expanded={more} onClick={() => setMore(!more)}>{more ? "− Fewer tools" : "+ More tools"}</button>{more && <ul className="tools">{tools.map(t => <li key={t}>{t}</li>)}</ul>}<div className="stack-foot"><span>UI</span><i /><span>API</span><i /><span>DATA</span><a href="#experience">Follow the request ↘</a></div></div></section>
      <section id="experience" className="section experience" aria-labelledby="experience-title"><div className="wrap"><div className="section-head"><span className="eyebrow">02 / From question to answer</span><h2 id="experience-title">A request, made visible.</h2></div><div className="experience-grid"><Demo active={chapter === "experience"} reduced={reduced} /><div className="experience-copy"><span className="eyebrow">Feb – May 2025 · Calicut, Kerala</span><h3>Intern<br />Team Thai</h3><p>Built an ERP assistant that turns plain-English questions into SQL Server queries with Llama 3 and Mistral.</p><p>Cut Flask API response time by about 35% through caching and batched record fetching.</p><p>Limited generated queries to SELECT statements and checked seven SQL injection patterns.</p><details><summary>More about the work</summary><p>{experience[0].points[3]}</p></details></div></div></div></section>
      <section id="projects" className="section projects" aria-labelledby="projects-title"><div className="wrap"><div className="section-head"><span className="eyebrow">03 / The response</span><h2 id="projects-title">Selected projects.</h2></div><div className="project-grid"><article className="project-card featured"><div className="project-image"><Image src="/suen-studio-preview.jpg" alt="Screenshot of the SU·EN Studio website" width={1200} height={750} /></div><div className="project-copy"><div className="project-top"><span>01 / 2026</span><span className="result-chip">● results</span></div><h3>SU·EN Studio</h3><p>Portfolio website for an architecture studio.</p><div className="tags">{projects[0].stack.map(t => <span key={t}>{t}</span>)}</div><div className="card-actions"><a href={projects[0].live} target="_blank" rel="noreferrer">Visit site ↗</a><details><summary>How I built it</summary><ul>{projects[0].points.map(p => <li key={p}>{p}</li>)}</ul></details></div></div></article><div className="small-projects">{projects.slice(1).map((p, index) => <article className="project-card" key={p.name}><span className="eyebrow">0{index + 2} / {p.period}</span><h3>{p.name}</h3><p>{p.tagline}</p>{p.currentPage && <p className="current-page">You are viewing this page.</p>}<div className="tags">{p.stack.slice(0, 4).map(t => <span key={t}>{t}</span>)}</div><div className="card-actions"><a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a><details><summary>How I built it</summary><ul>{p.points.map(point => <li key={point}>{point}</li>)}</ul></details></div></article>)}</div></div></div></section>
      <section id="education" className="section education" aria-labelledby="education-title"><div className="wrap"><div className="section-head"><span className="eyebrow">04 / The foundation</span><h2 id="education-title">Education.</h2></div><div className="education-grid"><div><div className="college"><span className="college-mark" aria-hidden="true">MCE</span><div><h3>{education.school}</h3><p>{education.location} · {education.period}</p></div></div><p className="degree">{education.degree}</p><p>{education.detail}</p><div className="achievement"><span className="eyebrow">Achievement</span><p>{achievements[0]}</p></div><div className="languages"><span className="eyebrow">Languages</span><p>{languages.map(l => l.name).join(" · ")}</p></div></div><div className="coursework"><span className="eyebrow">Selected coursework</span><ul>{education.coursework.map(c => <li key={c}>{c}</li>)}</ul></div></div></div></section>
      <section id="contact" className="section contact" aria-labelledby="contact-title"><div className="wrap contact-inner"><span className="eyebrow">05 / 200 OK</span><p>Email me about a full-stack role or a website you’re building.</p><a className="email" href={`mailto:${contact.email}`}>{contact.email}</a><div className="actions"><a className="primary" href={`mailto:${contact.email}`}>Send an email ↗</a><a className="outline" href={contact.resume} download>Download resume ↓</a></div><h2 id="contact-title">LET’S<br />TALK</h2><div className="contact-links"><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={contact.github} target="_blank" rel="noreferrer">GitHub ↗</a></div><p className="copyright">© {new Date().getFullYear()} Aghar Usman K T</p></div></section>
    </main>
    <Character chapter={chapter} reduced={reduced} />
  </>;
}

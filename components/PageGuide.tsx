"use client";

import { useEffect, useRef, useState } from "react";
import { guideCharacter } from "@/data";
interface GuideLink { href: string; label: string }

export default function PageGuide({ links, characterTrigger = false }: { links: GuideLink[]; characterTrigger?: boolean }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const latestProgress = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const character = useRef<HTMLButtonElement | null>(null);
  const ring = useRef<SVGCircleElement>(null);
  const targets = links.filter((link) => link.href.startsWith("#") && link.href.length > 1);
  const key = targets.map((link) => link.href).join("|");

  useEffect(() => {
    if (characterTrigger) {
      const toggle = (event: Event) => {
        character.current = (event as CustomEvent<HTMLButtonElement>).detail;
        setOpen(value => !value);
      };
      window.addEventListener(guideCharacter.navigationEvent, toggle);
      return () => window.removeEventListener(guideCharacter.navigationEvent, toggle);
    }
    const blockers = [document.getElementById("about"), document.getElementById("contact")].filter((element): element is HTMLElement => element !== null);
    if (!blockers.length) { setVisible(true); return; }
    const intersecting = new Set<Element>();
    for (const element of blockers) { const rect = element.getBoundingClientRect(); if (rect.bottom > 0 && rect.top < innerHeight) intersecting.add(element); }
    setVisible(intersecting.size === 0);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) { if (entry.isIntersecting && entry.intersectionRect.height > 1) intersecting.add(entry.target); else intersecting.delete(entry.target); }
      setVisible(intersecting.size === 0);
    }, { threshold: [0, 0.001] });
    blockers.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [characterTrigger]);

  useEffect(() => {
    if (!visible && !characterTrigger) setOpen(false);
    if (visible && ring.current) ring.current.style.strokeDashoffset = String(100 * (1 - latestProgress.current));
  }, [visible, characterTrigger]);

  useEffect(() => {
    let frame = 0;
    const sections = key.split("|").map((href, index) => {
      try { return { element: document.getElementById(decodeURIComponent(href.slice(1))), index }; }
      catch { return { element: null, index }; }
    });
    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? Math.max(0, Math.min(1, window.scrollY / total)) : 0;
      latestProgress.current = progress;
      if (ring.current) ring.current.style.strokeDashoffset = String(100 * (1 - progress));
      const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--site-header-height")) || 80;
      const marker = header + Math.min(window.innerHeight * .22, 180);
      let current = 0, nearest = -Infinity;
      for (const section of sections) {
        if (!section.element) continue;
        const top = section.element.getBoundingClientRect().top;
        if (top <= marker && top > nearest) { current = section.index; nearest = top; }
      }
      if (total > 0 && window.scrollY >= total - 2) {
        let last = -Infinity;
        for (const section of sections) {
          if (!section.element) continue;
          const top = section.element.getBoundingClientRect().top;
          if (top > last) { last = top; current = section.index; }
        }
      }
      setActive((previous) => previous === current ? previous : current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    update();
    return () => { if (frame) cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [key]);

  useEffect(() => {
    if (!open) return;
    const actor = character.current;
    actor?.setAttribute("aria-expanded", "true");
    root.current?.querySelector<HTMLElement>("nav button[aria-current], nav button")?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!root.current?.contains(event.target) && !actor?.contains(event.target)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); (actor ?? trigger.current)?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { actor?.setAttribute("aria-expanded", "false"); document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);

  function navigate(index: number) {
    const destination = targets[index];
    if (!destination) return;
    let element: HTMLElement | null;
    try { element = document.getElementById(decodeURIComponent(destination.href.slice(1))); } catch { return; }
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    element.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" });
    // Focus the destination without interrupting native scrolling.
    const focusTarget = element.querySelector<HTMLElement>("h1, h2") ?? element;
    const oldTabIndex = focusTarget.getAttribute("tabindex");
    if (oldTabIndex === null) focusTarget.setAttribute("tabindex", "-1");
    focusTarget.focus({ preventScroll: true });
    if (oldTabIndex === null) focusTarget.addEventListener("blur", () => focusTarget.removeAttribute("tabindex"), { once: true });
    setOpen(false);
  }

  if (!targets.length || (!visible && !characterTrigger)) return null;
  return (
    <div ref={root} className={characterTrigger ? "pg-root pg-from-character" : "pg-root"}>
      {open && <div id="page-guide-panel" className="pg-panel" role="region" aria-label="Page guide">
        <div className="pg-heading"><span>Page guide</span><span>{String(active + 1).padStart(2, "0")} / {String(targets.length).padStart(2, "0")}</span></div>
        <nav aria-label="Jump to section">{targets.map((link, index) => <button type="button" key={link.href} onClick={() => navigate(index)} aria-current={active === index ? "location" : undefined}><span className="pg-number">{String(index + 1).padStart(2, "0")}</span><span>{link.label}</span><span className="pg-marker" aria-hidden="true">{active === index ? "●" : "↗"}</span></button>)}</nav>
        <div className="pg-steps"><button type="button" disabled={active === 0} onClick={() => navigate(active - 1)}>↑ Previous</button><button type="button" disabled={active >= targets.length - 1} onClick={() => navigate(active + 1)}>Next ↓</button></div>
      </div>}
      <button ref={trigger} type="button" className="pg-trigger" aria-expanded={open} aria-controls={open ? "page-guide-panel" : undefined} onClick={() => setOpen(!open)} aria-label={open ? "Close page guide" : "Open page guide, current section: " + targets[active]?.label}>
        <span className="pg-dial" aria-hidden="true"><svg viewBox="0 0 36 36"><circle className="pg-ring-base" cx="18" cy="18" r="14" /><circle ref={ring} className="pg-ring" cx="18" cy="18" r="14" pathLength="100" /></svg><span>{open ? "×" : String(active + 1).padStart(2, "0")}</span></span><span>Page guide</span><span className="pg-trigger-arrow" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <style>{GUIDE_CSS}</style>
    </div>
  );
}

const GUIDE_CSS = "\n.pg-root{position:fixed;bottom:max(18px,env(safe-area-inset-bottom));right:max(20px,env(safe-area-inset-right));z-index:45;font-family:var(--font-mono,monospace);color:var(--color-text,#f2f0e9)}.pg-root *{box-sizing:border-box}.pg-trigger{display:flex;align-items:center;gap:10px;margin-left:auto;min-height:48px;padding:5px 14px 5px 6px;background:var(--color-surface,#151713);border:1px solid var(--color-border,#30322d);border-radius:4px;color:inherit;font:inherit;font-size:10px;cursor:pointer;box-shadow:0 6px 24px #0003;transition:border-color 150ms,transform 150ms}.pg-trigger-arrow{color:var(--color-accent,#ff744f);font-size:18px;margin-left:8px}.pg-dial{display:grid;place-items:center;width:36px;height:36px;position:relative;flex:none}.pg-dial>svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}.pg-dial circle{fill:none;stroke-width:1.5}.pg-ring-base{stroke:var(--color-border,#30322d)}.pg-ring{stroke:var(--color-accent,#ff744f);stroke-dasharray:100;stroke-dashoffset:100;stroke-linecap:round}.pg-dial>span{font-size:10px}.pg-panel{width:min(300px,calc(100vw - 40px));max-height:calc(100dvh - 160px);overflow-y:auto;overscroll-behavior:contain;background:var(--color-surface,#151713);border:1px solid var(--color-border,#30322d);border-radius:4px;padding:16px;margin-bottom:10px;box-shadow:0 12px 48px #0005;animation:pg-enter 180ms cubic-bezier(.22,1,.36,1) both}.pg-heading{display:flex;justify-content:space-between;gap:16px;font-size:10px;color:var(--color-text-muted,#a5a69d);padding-bottom:14px}.pg-heading>span:last-child{color:var(--color-accent,#ff744f)}.pg-panel nav{display:grid}.pg-panel button{font:inherit;cursor:pointer;color:inherit;background:none;border:0}.pg-panel nav button{display:flex;align-items:center;gap:16px;text-align:left;min-height:44px;font-size:12px;border-top:1px solid var(--color-border,#30322d);padding:8px 0}.pg-number{font-size:9px;color:var(--color-text-muted,#a5a69d)}.pg-marker{margin-left:auto;color:var(--color-text-muted,#a5a69d);font-size:11px}.pg-panel nav button[aria-current]{color:var(--color-accent,#ff744f)}.pg-panel nav button[aria-current] .pg-marker{color:inherit}.pg-steps{display:flex;justify-content:space-between;gap:16px;border-top:1px solid var(--color-border,#30322d);margin-top:8px;padding-top:8px}.pg-steps button{font-size:10px;min-height:44px;padding:8px 0}.pg-steps button:disabled{opacity:.35;cursor:default}.pg-root button:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:4px}@keyframes pg-enter{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@media(hover:hover) and (pointer:fine){.pg-trigger:hover{border-color:var(--color-accent,#ff744f);transform:translateY(-1px)}.pg-panel button:not(:disabled):hover{color:var(--color-accent,#ff744f)}}.pg-trigger:active{transform:translateY(1px)}@media(max-width:639px){.pg-trigger>span:not(.pg-dial){display:none}.pg-trigger{padding:5px;min-width:48px}.pg-root{bottom:max(12px,env(safe-area-inset-bottom));right:12px}.pg-panel{width:min(300px,calc(100vw - 24px))}}@media(prefers-reduced-motion:reduce){.pg-panel{animation:none}.pg-trigger{transition:none;transform:none!important}.pg-ring{visibility:hidden}}\n\n.pg-trigger{width:48px;min-width:48px;height:48px;padding:5px;justify-content:center}.pg-trigger>span:not(.pg-dial){display:none}.pg-dial{width:36px;height:36px}.pg-root{right:max(16px,env(safe-area-inset-right));bottom:max(16px,env(safe-area-inset-bottom))}.pg-panel{margin-left:auto}\n@media(max-width:639px){.pg-root{right:12px;bottom:max(12px,env(safe-area-inset-bottom))}}\n";

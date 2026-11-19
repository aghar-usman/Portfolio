"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";

interface NavLink { href: string; label: string }
interface NavbarProps { links: NavLink[] }

function Arrow() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Navbar({ links }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("");
  const header = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const unlock = useRef<(() => void) | null>(null);
  const [menuScope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  const closeButton = useRef<HTMLButtonElement>(null);
  const contact = links.find((link) => link.href === "#contact" || link.label.toLowerCase() === "contact");
  const navigation = links.filter((link) => link !== contact);
  const currentLink = links.find((link) => link.href === active);
  const sectionKey = links.map((link) => link.href).join("|");
  const home = links.find((link) => link.href === "#about")?.href ?? links[0]?.href ?? "#about";

  useEffect(() => {
    let frame = 0;
    // Resolve IDs directly rather than treating incoming hrefs as CSS selectors.
    const sections = sectionKey.split("|").flatMap((href) => {
      const link = { href };
      if (!link.href.startsWith("#") || link.href.length < 2) return [];
      let id: string;
      try { id = decodeURIComponent(link.href.slice(1)); } catch { return []; }
      const element = document.getElementById(id);
      return element ? [{ href: link.href, element }] : [];
    });
    const update = () => {
      frame = 0;
      const height = header.current?.getBoundingClientRect().height ?? 80;
      const marker = height + Math.min(window.innerHeight * .22, 180);
      let current = "";
      let nearest = -Infinity;
      for (const section of sections) {
        const top = section.element.getBoundingClientRect().top;
        if (top <= marker && top > nearest) { current = section.href; nearest = top; }
      }
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      // At the bottom, select the final section even when it is shorter than the viewport.
      if (total > 0 && window.scrollY >= total - 2) {
        let last = -Infinity;
        for (const section of sections) {
          const top = section.element.getBoundingClientRect().top;
          if (top > last) { last = top; current = section.href; }
        }
      }
      setActive((previous) => previous === current ? previous : current);
      if (progress.current) progress.current.style.transform = "scaleX(" + ratio + ")";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    update();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
    };
  }, [sectionKey]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 960px)");
    const closeOnDesktop = () => {
      if (!desktop.matches) return;
      unlock.current?.();
      dialog.current?.close();
      setIsOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen || !dialog.current) return;
    const panel = dialog.current;
    if (!panel.open) panel.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let restored = false;
    const restore = () => {
      if (restored) return;
      document.body.style.overflow = previousOverflow;
      restored = true;
    };
    unlock.current = restore;
    closeButton.current?.focus();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && menuScope.current) {
      animate(menuScope.current, { opacity: [0, 1], y: [-6, 0] }, { duration: .22, ease: [.22, 1, .36, 1] });
    }
    return () => { restore(); unlock.current = null; };
  }, [isOpen, animate, menuScope]);

  useEffect(() => {
    if (reduced && menuScope.current) {
      animate(menuScope.current, { opacity: 1, y: 0 }, { duration: 0 });
    }
  }, [reduced, animate, menuScope]);

  function closeMenu() {
    unlock.current?.();
    dialog.current?.close();
    setIsOpen(false);
  }

  return (
    <>
      <header ref={header} className="an-header">
        <div className="an-wrap">
          <a className="an-brand" href={home} aria-label="Aghar Usman, introduction">AUKT<span aria-hidden="true">.</span></a>
          <nav className="an-desktop" aria-label="Main navigation">
            {navigation.map((link) => <a key={link.href} className="an-link" href={link.href} aria-current={active === link.href ? "location" : undefined}>{link.label.charAt(0).toUpperCase() + link.label.slice(1)}</a>)}
          </nav>
          {contact && <a className="an-contact" href={contact.href} aria-current={active === contact.href ? "location" : undefined}>Contact me <Arrow /></a>}
          <button ref={toggle} className="an-toggle" type="button" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="an-mobile-menu" onClick={() => setIsOpen(true)}><span className="an-toggle-copy">{currentLink && <span className="an-current-label" aria-hidden="true">{currentLink.label}</span>}<span>Menu</span></span><span className="an-menu-icon" aria-hidden="true"><i /><i /></span></button>
        </div>
        <div className="an-progress-track" aria-hidden="true"><div ref={progress} className="an-progress" /></div>
      </header>

      <dialog ref={dialog} id="an-mobile-menu" className="an-dialog" aria-labelledby="an-menu-title" onClose={() => { unlock.current?.(); setIsOpen(false); }}>
        <div ref={menuScope} className="an-dialog-content">
        <div className="an-dialog-top"><span id="an-menu-title" className="an-menu-title">Navigation<span>.</span></span><button ref={closeButton} className="an-close" type="button" onClick={closeMenu} aria-label="Close navigation"><span>Close</span><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" stroke="currentColor" strokeWidth="1.5" /></svg></button></div>
        <nav className="an-mobile-links" aria-label="Mobile navigation">{links.map((link) => <a href={link.href} key={link.href} aria-current={active === link.href ? "location" : undefined} onClick={closeMenu}><span className="an-mobile-label">{link.label.charAt(0).toUpperCase() + link.label.slice(1)}</span><Arrow /></a>)}</nav>
        </div>
      </dialog>
      <style>{NAV_CSS + NAV_REFINEMENTS}</style>
    </>
  );
}

const NAV_CSS = "\n.an-header{position:sticky;top:0;z-index:50;height:var(--site-header-height,80px);background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);border-bottom:1px solid var(--color-border,#30322d)}\n.an-header *,.an-dialog *{box-sizing:border-box}.an-wrap{width:min(100% - 96px,1248px);height:100%;margin-inline:auto;display:flex;align-items:center;gap:36px}.an-brand{text-decoration:none;color:inherit;font-weight:650;font-size:23px;letter-spacing:-.065em;min-height:44px;display:inline-flex;align-items:center;flex:none}.an-brand span,.an-menu-title span{color:var(--color-accent,#ff744f)}\n.an-desktop{display:flex;align-items:center;justify-content:center;gap:26px;margin-left:auto}.an-link{display:inline-flex;align-items:center;position:relative;min-height:44px;color:var(--color-text-muted,#a5a69d);text-decoration:none;font-size:13px;line-height:1.5;transition:color 150ms}.an-link:after{content:\"\";position:absolute;left:0;right:0;bottom:5px;height:2px;background:var(--color-accent,#ff744f);transform:scaleX(0);transform-origin:left;transition:transform 180ms cubic-bezier(.2,.8,.2,1)}.an-link[aria-current=\"location\"]{color:var(--color-text,#f2f0e9)}.an-link[aria-current=\"location\"]:after{transform:scaleX(1)}\n.an-contact{display:inline-flex;align-items:center;justify-content:center;gap:18px;flex:none;min-height:44px;padding:10px 16px;border:1px solid var(--color-border,#30322d);border-radius:4px;color:var(--color-text,#f2f0e9);text-decoration:none;font-size:12px;font-weight:600;transition:background-color 150ms,border-color 150ms,transform 150ms}.an-contact svg{transition:transform 150ms}.an-contact[aria-current=\"location\"]{border-color:var(--color-accent,#ff744f)}\n.an-progress-track{position:absolute;bottom:-1px;inset-inline:0;height:2px;pointer-events:none;overflow:hidden}.an-progress{width:100%;height:100%;background:var(--color-accent,#ff744f);transform:scaleX(0);transform-origin:left;will-change:transform}\n.an-toggle,.an-close{border:0;background:none;color:inherit;font-family:var(--font-mono,monospace);font-size:12px;min-width:44px;min-height:44px;cursor:pointer;align-items:center;justify-content:center;gap:14px;padding:8px 0}.an-toggle{display:none;margin-left:auto}.an-menu-icon{display:flex;flex-direction:column;gap:5px;width:20px}.an-menu-icon i{display:block;width:20px;height:1px;background:currentColor}.an-menu-icon i:last-child{width:13px;align-self:flex-end;transition:width 150ms}.an-header a:focus-visible,.an-header button:focus-visible,.an-dialog a:focus-visible,.an-dialog button:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}\n.an-dialog{margin:0;border:0;width:100%;height:100%;max-width:none;max-height:none;position:fixed;inset:0;z-index:100;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);padding:0;overflow-y:auto;overscroll-behavior:contain;}.an-dialog-top{height:var(--site-header-height,80px);flex:none;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--color-border,#30322d);gap:24px}.an-menu-title{font-size:20px;letter-spacing:-.04em}.an-close{display:inline-flex}.an-mobile-links{margin-block:auto;padding-block:32px}.an-mobile-links a{display:flex;align-items:center;gap:24px;min-height:74px;border-bottom:1px solid var(--color-border,#30322d);color:inherit;text-decoration:none;transition:color 150ms}.an-number{font-family:var(--font-mono,monospace);font-size:11px;color:var(--color-text-muted,#a5a69d)}.an-mobile-label{flex:1;font-size:clamp(26px,5vw,42px);letter-spacing:-.045em;overflow-wrap:anywhere}.an-mobile-links a>svg{width:22px;height:22px;flex:none;transition:transform 150ms}.an-mobile-links a[aria-current=\"location\"]{color:var(--color-accent,#ff744f)}.an-dialog-bottom{display:flex;justify-content:space-between;gap:20px;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-text-muted,#a5a69d);padding-top:16px}\n@keyframes an-menu-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}\n@media(hover:hover) and (pointer:fine){.an-link:hover{color:var(--color-text,#f2f0e9)}.an-link:hover:after{transform:scaleX(1)}.an-contact:hover{background:var(--color-surface,#151713);border-color:var(--color-accent,#ff744f);transform:translateY(-1px)}.an-contact:hover svg,.an-mobile-links a:hover>svg{transform:translateX(3px)}.an-toggle:hover .an-menu-icon i:last-child{width:20px}.an-mobile-links a:hover,.an-toggle:hover,.an-close:hover{color:var(--color-accent,#ff744f)}}.an-contact:active{transform:translateY(1px) scale(.985)}\n@media(max-width:1100px){.an-wrap{gap:24px}.an-desktop{gap:18px}.an-link{font-size:12px}}\n@media(max-width:1023px){.an-wrap{width:calc(100% - 64px)}}\n@media(max-width:959px){.an-desktop,.an-contact{display:none}.an-toggle{display:inline-flex}}\n@media(max-width:639px){.an-wrap{width:calc(100% - 40px)}.an-dialog-content{padding-inline:20px}.an-brand{font-size:22px}.an-mobile-links a{min-height:68px}.an-dialog-bottom{flex-direction:column;gap:4px}}\n@media(prefers-reduced-motion:reduce){.an-dialog{animation:none}.an-header *,.an-header *:after,.an-dialog *{transition:none!important}.an-contact:hover,.an-contact:active,.an-contact svg,.an-mobile-links a>svg{transform:none!important}.an-progress-track{display:none}}\n\n.an-dialog:not([open]){display:none}.an-dialog::backdrop{background:var(--color-bg,#0c0d0c)}.an-dialog-content{box-sizing:border-box;min-height:100%;display:flex;flex-direction:column;padding:0 32px max(24px,env(safe-area-inset-bottom))}.an-dialog .an-mobile-links{flex:none}.an-toggle-copy{display:flex;align-items:center;gap:14px}.an-current-label{color:var(--color-text-muted,#a5a69d);padding-right:14px;border-right:1px solid var(--color-border,#30322d);max-width:14ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.an-contact{background:var(--color-surface,#151713)}\n@media(max-width:639px){.an-dialog-content{padding-inline:20px}}\n@media(max-height:600px){.an-dialog-content{padding-bottom:16px}.an-mobile-links{padding-block:20px}.an-mobile-links a{min-height:56px}.an-mobile-label{font-size:28px}}\n\n.an-brand{font-size:22px;font-weight:600;letter-spacing:-.055em}.an-desktop{gap:28px}.an-link{font-size:12px}.an-contact{font-size:12px;font-weight:500;background:transparent;gap:20px}.an-contact svg{width:16px;height:16px}.an-toggle{font-size:11px}.an-mobile-label{font-weight:500}.an-dialog-bottom{letter-spacing:0}\n@media(max-width:1100px){.an-desktop{gap:20px}}\n";

const NAV_REFINEMENTS = `
.an-link { font-size: 13px; }
.an-current-label { text-transform: capitalize; }
.an-mobile-links a { gap: 16px; }
.an-mobile-links a[aria-current="location"] .an-mobile-label { text-decoration: underline; text-underline-offset: .22em; text-decoration-thickness: 1px; }
.an-mobile-links a[aria-current="location"] > svg { color: var(--color-accent, #ff744f); }
@media (max-width: 360px) { .an-current-label { display: none; } }
`;

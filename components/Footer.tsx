"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";

export interface ContactInfo { email: string; linkedin: string; github: string; resume: string }
interface FooterProps { contact: ContactInfo }
type CopyState = "idle" | "copying" | "copied" | "error";

function Arrow({ up = false }: { up?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={up ? "M12 20V4m-6 6 6-6 6 6" : "M6 18 18 6M6 6h12v12"} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Footer({ contact }: FooterProps) {
  const [scope, animate] = useAnimate<HTMLElement>();
  const reduced = useReducedMotion();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const email = contact.email.trim();
  const emailHref = "mailto:" + encodeURIComponent(email).replace(/%40/g, "@");

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); };
  }, []);

  useEffect(() => {
    if (copyState !== "copied" || reduced || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const feedback = animate(".af-copy svg", { opacity: [.5, 1], scale: [.85, 1] }, { duration: .18, ease: [.22, 1, .36, 1] });
    return () => { feedback.stop(); };
  }, [copyState, reduced, animate]);

  async function copyEmail() {
    if (!email || copyState === "copying") return;
    if (timer.current) clearTimeout(timer.current);
    setCopyState("copying");
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(email);
      if (!mounted.current) return;
      setCopyState("copied");
      timer.current = setTimeout(() => { if (mounted.current) setCopyState("idle"); }, 2200);
    } catch {
      if (mounted.current) setCopyState("error");
    }
  }

  return (
    <footer ref={scope} id="contact" className="af-footer" aria-labelledby="af-title">
      <div className="af-wrap">
        <div className="af-label"><span>05 /</span>Contact<i aria-hidden="true" /></div>
        <div className="af-main">
          <div className="af-invitation">
            <h2 id="af-title">Let’s build something <span>extraordinary</span> together.</h2>
            <p className="af-intro">For development roles or website projects, send me a little about what you have in mind.</p>
            {email && <>
              <a className="af-email" href={emailHref}>{email}</a>
              <div className="af-actions">
                <a className="af-button af-primary" href={emailHref}>Email me <Arrow /></a>
                <button className="af-button af-copy" type="button" onClick={copyEmail} disabled={copyState === "copying"}>{copyState === "copied" ? "Copied" : copyState === "copying" ? "Copying…" : "Copy email"}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">{copyState === "copied" ? <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /> : <><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="1.5" /></>}</svg></button>
              </div>
              <p className="af-copy-status" role="status" aria-live="polite" aria-atomic="true">{copyState === "copied" ? "Email address copied." : copyState === "error" ? "Couldn’t copy. You can select the email address above." : ""}</p>
            </>}
          </div>

          {(contact.github || contact.linkedin || contact.resume) && <nav className="af-links" aria-label="Profiles and résumé">
            <p className="af-links-label">Find me elsewhere</p>
            {contact.github && <a href={contact.github} target="_blank" rel="noopener noreferrer" aria-label="View my GitHub profile (opens in a new tab)"><span>GitHub</span><Arrow /></a>}
            {contact.linkedin && <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="View my LinkedIn profile (opens in a new tab)"><span>LinkedIn</span><Arrow /></a>}
            {contact.resume && <a href={contact.resume} target="_blank" rel="noopener noreferrer" aria-label="View my résumé (opens in a new tab)"><span>Résumé</span><Arrow /></a>}
          </nav>}
        </div>

        <div className="af-bottom"><p>© {new Date().getFullYear()} Aghar Usman K T</p><a className="af-top" href="#about">Back to top <Arrow up /></a></div>
      </div>
      <style>{FOOTER_CSS}</style>
    </footer>
  );
}

const FOOTER_CSS = "\n.af-footer{position:relative;box-sizing:border-box;background:var(--color-bg,#0c0d0c);color:var(--color-text,#f2f0e9);font-family:var(--font-sans,Arial,sans-serif);scroll-margin-top:var(--site-header-height,80px);padding-block:72px 24px;display:flex;align-items:center}.af-footer *{box-sizing:border-box}.af-wrap{width:min(100% - 96px,1248px);margin-inline:auto}.af-label{display:flex;align-items:center;gap:12px;font-family:var(--font-mono,monospace);font-size:12px;line-height:1.6;color:var(--color-text-muted,#a5a69d);margin-bottom:40px}.af-label>span{color:var(--color-accent,#ff744f)}.af-label i{display:block;width:64px;height:1px;margin-left:6px;background:var(--color-border,#30322d)}.af-main{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,.8fr);gap:clamp(48px,8vw,128px);align-items:start}.af-invitation{min-width:0}.af-invitation h2{font-size:clamp(42px,4.8vw,68px);font-weight:500;line-height:1.04;letter-spacing:-.065em;margin:0 0 24px;text-wrap:balance}.af-invitation h2>span{color:var(--color-accent,#ff744f)}.af-intro{max-width:41ch;font-size:16px;line-height:1.75;color:var(--color-text-muted,#a5a69d);margin:0 0 28px;text-wrap:pretty}.af-email{display:inline-block;max-width:100%;font-size:clamp(17px,1.8vw,24px);line-height:1.6;font-weight:400;letter-spacing:-.025em;color:var(--color-text,#f2f0e9);text-decoration:underline;text-decoration-color:var(--color-border,#30322d);text-underline-offset:7px;overflow-wrap:anywhere;transition:text-decoration-color 150ms}.af-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:24px}.af-button{display:inline-flex;align-items:center;justify-content:space-between;gap:28px;min-height:50px;padding:13px 20px;border:1px solid var(--color-border,#30322d);border-radius:4px;font-family:inherit;font-size:14px;font-weight:600;line-height:1.5;text-decoration:none;cursor:pointer;transition:background-color 150ms,border-color 150ms,transform 150ms}.af-primary{background:var(--color-accent,#ff744f);border-color:transparent;color:#17110d}.af-copy{min-width:158px;background:transparent;color:var(--color-text,#f2f0e9)}.af-button svg{flex:none;transition:transform 150ms}.af-copy:disabled{cursor:wait;opacity:.7}.af-copy-status{min-height:38px;margin:10px 0 0;font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-text-muted,#a5a69d);max-width:48ch}.af-links{padding-top:8px;min-width:0}.af-links-label{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);margin:0 0 22px}.af-links>a{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:72px;border-top:1px solid var(--color-border,#30322d);color:var(--color-text,#f2f0e9);text-decoration:none;font-size:21px;letter-spacing:-.035em;transition:color 150ms}.af-links>a:last-child{border-bottom:1px solid var(--color-border,#30322d)}.af-links>a>span{display:flex;align-items:center;gap:20px;min-width:0}.af-link-number{font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-text-muted,#a5a69d);letter-spacing:0}.af-links svg{flex:none;color:var(--color-accent,#ff744f);transition:transform 150ms}.af-signoff{display:flex;align-items:baseline;justify-content:space-between;gap:32px;margin-top:48px;padding-block:32px;border-block:1px solid var(--color-border,#30322d)}.af-wordmark{color:var(--color-text,#f2f0e9);font-size:clamp(28px,4vw,54px);font-weight:500;letter-spacing:-.055em;line-height:1.2;text-decoration:none;overflow-wrap:anywhere}.af-wordmark span{color:var(--color-accent,#ff744f)}.af-signoff-note{font-family:var(--font-mono,monospace);font-size:11px;line-height:1.7;color:var(--color-text-muted,#a5a69d);text-align:right}.af-bottom{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-top:12px}.af-bottom p{font-family:var(--font-mono,monospace);font-size:10px;line-height:1.7;color:var(--color-text-muted,#a5a69d);margin:0}.af-top{display:inline-flex;align-items:center;gap:12px;min-height:44px;color:var(--color-text-muted,#a5a69d);font-size:11px;text-decoration:none;transition:color 150ms}.af-top svg{width:16px;height:16px;transition:transform 150ms}.af-footer a:focus-visible,.af-footer button:focus-visible{outline:2px solid var(--color-accent,#ff744f);outline-offset:5px}\n@media(hover:hover) and (pointer:fine){.af-email:hover{text-decoration-color:var(--color-accent,#ff744f)}.af-button:not(:disabled):hover{transform:translateY(-1px)}.af-primary:hover{background:var(--color-accent-hover,#ff8a6a)}.af-copy:not(:disabled):hover{background:var(--color-surface,#151713);border-color:var(--color-text-muted,#a5a69d)}.af-primary:hover svg,.af-links>a:hover svg{transform:translateX(3px)}.af-links>a:hover,.af-top:hover{color:var(--color-accent,#ff744f)}.af-top:hover svg{transform:translateY(-3px)}}.af-button:not(:disabled):active{transform:translateY(1px) scale(.985)}\n@media(max-width:1023px){.af-wrap{width:calc(100% - 64px)}.af-footer{padding-top:56px}.af-main{gap:40px;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}.af-intro{font-size:15px}.af-links>a{font-size:20px}.af-signoff{margin-top:36px}.af-signoff-note{font-size:10px}}\n@media(max-width:639px){.af-wrap{width:calc(100% - 40px)}.af-footer{padding-block:40px 16px}.af-label{font-size:11px;margin-bottom:32px}.af-main{grid-template-columns:minmax(0,1fr);gap:24px}.af-invitation h2{font-size:clamp(36px,10vw,48px);margin-bottom:20px}.af-intro{font-size:15px;margin-bottom:24px}.af-email{font-size:18px}.af-actions{gap:10px;margin-top:24px}.af-button{width:100%;min-height:48px;font-size:13px}.af-copy-status{min-height:34px}.af-links{padding-top:0}.af-links-label{margin-bottom:18px}.af-links>a{min-height:64px;font-size:20px}.af-signoff{margin-top:36px;padding-block:24px;flex-direction:column;gap:12px}.af-wordmark{font-size:34px}.af-signoff-note{text-align:left}.af-bottom{gap:16px}.af-bottom p{max-width:22ch;font-size:9px}.af-top{font-size:10px;gap:8px}}\n@media(prefers-reduced-motion:reduce){.af-footer *{transition:none!important}.af-button:hover,.af-button:active,.af-button svg,.af-links>a svg,.af-top svg{transform:none!important}}\n\n.af-label{font-size:11px;margin-bottom:32px}.af-label i{display:none}.af-main{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:clamp(40px,7vw,112px);align-items:center}.af-invitation h2{font-size:clamp(40px,4.6vw,64px);line-height:1.08;letter-spacing:-.055em;max-width:21ch;overflow-wrap:anywhere}.af-intro{font-size:15px;max-width:43ch;line-height:1.8}.af-email{font-size:clamp(17px,1.6vw,22px)}.af-button{font-size:13px}.af-links>a{font-size:19px;min-height:64px}.af-links-label{font-size:10px;margin-bottom:18px}.af-copy svg{transform-origin:center}.af-bottom{margin-top:40px;border-top:1px solid var(--color-border,#30322d);padding-top:16px}.af-bottom p{font-size:10px}\n@media(max-width:959px){.af-main{grid-template-columns:minmax(0,1fr);gap:28px}.af-invitation{max-width:700px}.af-links{max-width:480px;width:100%}.af-invitation h2{font-size:clamp(40px,6.5vw,60px)}}\n@media(max-width:639px){.af-invitation h2{font-size:clamp(36px,9.5vw,46px);max-width:20ch}.af-intro{font-size:14px}.af-email{font-size:17px}.af-links>a{font-size:18px;min-height:60px}.af-bottom{margin-top:30px}.af-bottom p{font-size:9px}.af-copy-status{min-height:36px}.af-footer{padding-bottom:24px}}\n";

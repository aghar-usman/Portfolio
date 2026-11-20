"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { requestDemo as demo } from "@/data";
import styles from "./RequestDemo.module.css";

const motionPreference = "(prefers-reduced-motion: reduce)";
const { timing } = demo;

function subscribe(callback: () => void) {
  const media = window.matchMedia(motionPreference);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function typed(text: string, elapsed: number, start: number, end: number) {
  const portion = Math.min(1, Math.max(0, (elapsed - start) / (end - start)));
  return text.slice(0, Math.floor(portion * text.length));
}

function packet(progress: number) {
  window.dispatchEvent(new CustomEvent<number>(demo.event, { detail: progress }));
}

export default function RequestDemo() {
  const frame = useRef(0);
  const started = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(-1);
  const reduced = useSyncExternalStore(subscribe, () => window.matchMedia(motionPreference).matches, () => false);
  const elapsed = reduced ? timing.done : time;

  const run = useCallback(() => {
    started.current = true;
    cancelAnimationFrame(frame.current);
    if (window.matchMedia(motionPreference).matches) {
      setTime(timing.done);
      return;
    }

    setTime(0);
    packet(0);
    const start = performance.now();
    function update(now: number) {
      const next = Math.min(timing.done, now - start);
      setTime(next);
      packet(Math.min(1, next / timing.resultStart));
      if (next < timing.done) frame.current = requestAnimationFrame(update);
      else window.dispatchEvent(new Event(demo.blockedEvent));
    }
    frame.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    if (reduced) {
      cancelAnimationFrame(frame.current);
      packet(1);
      return;
    }
    if (!root.current || started.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < .5) return;
      observer.disconnect();
      if (!started.current) run();
    }, { threshold: .5 });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [reduced, run]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const status = elapsed >= timing.done ? demo.status.blocked
    : elapsed >= timing.resultStart ? demo.status.results
    : elapsed >= timing.queryStart ? demo.status.query
    : elapsed >= 0 ? demo.status.question : demo.status.idle;
  const hasResults = elapsed >= timing.resultStart;
  const hasRejection = elapsed >= timing.done;

  return (
    <div ref={root} className={styles.demo} data-request-demo>
      <div className={styles.header}>
        <h3>{demo.title}</h3>
        <button type="button" onClick={run}>{elapsed < 0 ? demo.run : demo.replay}</button>
      </div>
      <p className={styles.status} role="status" aria-live="polite" aria-atomic="true">{status}</p>
      <div className={styles.prompt}>
        <span>{demo.questionLabel}</span>
        <p aria-hidden="true">{typed(demo.question, elapsed, 0, timing.questionEnd)}</p>
        {elapsed >= timing.questionEnd && <p className="sr-only">{demo.question}</p>}
      </div>
      <div className={styles.sql}>
        <span>{demo.queryLabel}</span>
        <pre aria-hidden="true"><code>{typed(demo.query, elapsed, timing.queryStart, timing.queryEnd)}</code></pre>
        {elapsed >= timing.queryEnd && <pre className="sr-only"><code>{demo.query}</code></pre>}
      </div>
      <table className={styles.results} data-visible={hasResults || undefined} aria-hidden={!hasResults}>
        <caption>{demo.resultsLabel}</caption>
        <thead><tr>{demo.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{demo.rows.map(([order, state], index) => {
          const visible = elapsed >= timing.resultStart + index * timing.rowGap;
          return <tr key={order} data-visible={visible || undefined} aria-hidden={!visible}><td>{order}</td><td>{state}</td></tr>;
        })}</tbody>
      </table>
      <div className={styles.blocked} data-visible={elapsed >= timing.blockStart || undefined}>
        <code aria-hidden="true">{typed(demo.blocked.question, elapsed, timing.blockStart, timing.blockEnd)}</code>
        {hasRejection && <code className="sr-only">{demo.blocked.question}</code>}
        <span className={styles.rejection} data-visible={hasRejection || undefined} aria-hidden={!hasRejection}>{demo.blocked.badge}</span>
        <p className={styles.rejection} data-visible={hasRejection || undefined} aria-hidden={!hasRejection}>{demo.blocked.message}</p>
      </div>
    </div>
  );
}

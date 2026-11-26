"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Database, ShieldCheck, RotateCcw } from "lucide-react";
import { experience } from "@/data";
import s from "./ExperienceLab.module.css";

const examples = ["Show pending orders", "Show shipped orders", "How many orders are there?", "Delete all orders"];
const orders = [{ id: "DEMO-104", status: "Pending", total: 2400 }, { id: "DEMO-108", status: "Pending", total: 1850 }, { id: "DEMO-113", status: "Shipped", total: 3200 }];
function resolve(question: string) {
  if (/\b(delete|drop|update|insert|alter|truncate|remove)\b/i.test(question)) return { blocked: true, sql: "— Request stopped before execution —", rows: [], message: "This request would change data. The assistant only allows read-only SELECT queries." };
  if (/\b(count|many|number)\b/i.test(question)) return { blocked: false, sql: "SELECT COUNT(*) AS order_count\nFROM orders;", rows: orders, count: true, message: "The sample database contains 3 orders. No records were changed." };
  if (/\b(pending|shipped|orders)\b/i.test(question)) {
    const status = /pending/i.test(question) ? "Pending" : /shipped/i.test(question) ? "Shipped" : null;
    return { blocked: false, sql: `SELECT order_id, status, total\nFROM orders${status ? `\nWHERE status = '${status.toLowerCase()}'` : ""};`, rows: orders.filter(o => !status || o.status === status), message: "Read-only query approved. These fictional records are returned to the interface." };
  }
  return null;
}

export default function ExperienceLab() {
  const [question, setQuestion] = useState(examples[0]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<ReturnType<typeof resolve>>(null);
  const [error, setError] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const busy = step > 0 && step < 4;
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function run() {
    const next = resolve(question.trim());
    if (!next) { setError("Try asking about pending orders, shipped orders, or the number of orders."); return; }
    timers.current.forEach(clearTimeout);
    setError(""); setResult(next); setStep(1);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setStep(4); return; }
    [2, 3, 4].forEach((phase, i) => timers.current.push(setTimeout(() => setStep(phase), (i + 1) * 1100)));
  }
  const phaseCopy = ["Choose a question. Follow it from the interface to the database.", "The interface sends your question to the API.", "The assistant translates the question into SQL.", result?.blocked ? "The safety check rejects a request that would change data." : "The safety check allows a read-only SELECT query.", result?.message || ""];
  return <section id="experience" className={`section ${s.section}`} aria-labelledby="experience-title"><div className="wrap">
    <div className={s.heading}><div><p className={s.context}>Team Thai · Internship · Feb – May 2025</p><h2 id="experience-title">Plain English.<br /><em>Useful answers.</em></h2></div><p>At Team Thai, I built an ERP assistant that turns everyday questions into SQL Server queries. Explore a simplified version of that journey below.</p></div>
    <div className={s.lab}>
      <div className={s.labHead}><span><Database size={18} aria-hidden="true" /> ERP request playground</span><span>Interactive simulation · fictional data</span></div>
      <form onSubmit={e => { e.preventDefault(); run(); }} className={s.form}>
        <label htmlFor="erp-question">What would you like to know?</label>
        <div className={s.inputRow}><input id="erp-question" value={question} maxLength={160} disabled={busy} onChange={e => { setQuestion(e.target.value); setError(""); setStep(0); setResult(null); }} aria-describedby={error ? "erp-error" : "erp-help"} /><button disabled={busy || !question.trim()} type="submit">{busy ? "Following request…" : step === 4 ? "Run again" : "Run request"}<ArrowRight size={18} aria-hidden="true" /></button></div>
        <p id="erp-help" className={s.help}>Try a sample, or type a question about the sample orders.</p>
        <div className={s.presets}>{examples.map(q => <button type="button" key={q} disabled={busy} aria-pressed={question === q} onClick={() => { setQuestion(q); setError(""); setStep(0); setResult(null); }}>{q}</button>)}</div>
        {error && <p role="alert" id="erp-error">{error}</p>}
      </form>
      <ol className={s.flow} aria-label="Request journey">{["Your question", "Generate SQL", "Safety check", "Answer"].map((label, i) => <li key={label} data-current={step === i + 1} data-done={step > i + 1}><span>{step > i + 1 ? <Check size={15} /> : i + 1}</span>{label}</li>)}</ol>
      <p className={s.narration} role="status" aria-live="polite">{phaseCopy[step]}</p>
      <div className={s.output}>
        <div className={s.query}><h3>Behind the question <span>SQL</span></h3><pre>{step >= 2 && result ? result.sql : "Your generated query will appear here."}</pre><p><ShieldCheck size={16} aria-hidden="true" />{step >= 3 ? result?.blocked ? "Blocked · no database access" : "Approved · SELECT only" : "Every query passes a read-only safety check."}</p></div>
        <div className={s.answer}><h3>The answer <span>Sample orders</span></h3>{step === 4 && result ? result.blocked ? <div className={s.blocked}><ShieldCheck size={28} /><strong>Data stays untouched.</strong><p>Changing or deleting records is outside the assistant’s permissions. Try a read-only question above.</p></div> : result.count ? <p className={s.count}><strong>3</strong> orders in the sample database</p> : <table><thead><tr><th>Order</th><th>Status</th><th>Total (₹)</th></tr></thead><tbody>{result.rows.map(row => <tr key={row.id}><td>{row.id}</td><td>{row.status}</td><td>{row.total.toLocaleString("en-IN")}</td></tr>)}</tbody></table> : <p className={s.empty}>{busy ? "Your request is moving through the pipeline…" : "Run a request to see the answer here."}</p>}</div>
      </div>
      <div className={s.foot}><span>This local walkthrough uses preset rules, not a live AI model or Team Thai data.</span><button type="button" disabled={busy} onClick={() => { setStep(0); setResult(null); setQuestion(examples[0]); setError(""); }}><RotateCcw size={14} />Reset</button></div>
    </div>
    <div className={s.work}><div><p className={s.context}>What I built · Calicut, Kerala</p><h3>Intern at Team Thai</h3><p>Llama 3 and Mistral translated questions into SQL, with fallback handling, retries, and caching.</p></div><div><p><strong>About 35% faster Flask API responses</strong> through caching and batched record fetching.</p><p><strong>Read-only access by design.</strong> Restricted generated queries to SELECT statements and checked seven SQL injection patterns.</p><details><summary>Data pipeline & implementation details</summary><p>{experience[0].points[1]}</p><p>{experience[0].points[3]}</p></details></div></div>
  </div></section>;
}

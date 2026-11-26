"use client";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import s from "./skiper40.module.css";
type LinkProps = ComponentPropsWithoutRef<"a"> & { href: string };
// Free Skiper40 CssLink adapted to portfolio tokens, keyboard and touch input.
function AnimatedLink({ children, className = "", variant = "forward", rel, target, ...props }: LinkProps & { variant?: "plain" | "forward" | "center" }) {
  const shared = {
    ...props, target,
    rel: target === "_blank" ? Array.from(new Set(`${rel || ""} noopener noreferrer`.trim().split(/\s+/))).join(" ") : rel,
    className: `${s.link} ${s[variant]} ${className}`,
    children: <><span className={s.label}>{children}</span>{variant !== "plain" && <svg className={s.arrow} fill="none" viewBox="0 0 10 10" aria-hidden="true"><path d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>}</>,
  };
  return variant === "plain" ? <Link {...shared} /> : <a {...shared} />;
}
export function Link000(props: LinkProps) { return <AnimatedLink {...props} variant="plain" />; }
export function Link001(props: LinkProps) { return <AnimatedLink {...props} variant="forward" />; }
export function Link002(props: LinkProps) { return <AnimatedLink {...props} variant="center" />; }
/**
 * Skiper 40 Animated Link — React
 * Inspired by and adapted from https://cursor.com/?from=home
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the cursor.com . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */



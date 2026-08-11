"use client";

import React, { useRef, useState, useEffect, useCallback, useTransition } from "react";
import Image from "next/image";
import ReflectiveCard from "./ReflectiveCard/ReflectiveCard";
import StarBorder from "./StarBorder/StarBorder";
import { Award, ExternalLink, Trophy, GraduationCap, Languages, ShieldCheck, BookOpen, Sparkles } from "lucide-react";

export interface Education {
  school: string;
  location: string;
  degree: string;
  detail: string;
  period: string;
  coursework: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  badgeUrl?: string;
  credentialUrl?: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface EducationAndExtrasProps {
  education: Education;
  certifications: Certification[];
  achievements: string[];
  languages: Language[];
}

export default function EducationAndExtras({
  education,
  certifications,
  achievements,
  languages,
}: EducationAndExtrasProps) {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [, startTransition] = useTransition();
  const [isMobile, setIsMobile] = useState<boolean>(true); // Default true to prevent heavy mobile paint on initial SSR render
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Defer heavy calculations and force fast mobile detection on initial paint
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    let ticking = false;
    const checkMobile = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsMobile(window.innerWidth < 768);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use transition for non-blocking tab switches to guarantee zero input latency
  const handleTabChange = useCallback((tabIndex: number) => {
    startTransition(() => {
      setActiveTab(tabIndex);
    });
  }, []);

  // Optimized lightweight mouse move with strict boundary guards
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !spotlightRef.current) return;
    const currentRef = spotlightRef.current;
    window.requestAnimationFrame(() => {
      const rect = currentRef.getBoundingClientRect();
      currentRef.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      currentRef.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  }, [isMobile]);

  return (
    <section id="education" className="py-12 sm:py-16 flex flex-col gap-8 sm:gap-12 w-full max-w-full overflow-hidden box-border">
      <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--color-text)]">
        education & credentials
      </h2>

      {/* Main Grid: Education & Interactive Credentials Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch w-full min-w-0">
        
        {/* Left Side: Education Terminal Card */}
        <div
          ref={spotlightRef}
          onMouseMove={handleMouseMove}
          className="lg:col-span-7 relative p-4 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden group flex flex-col justify-between transition-colors duration-200 hover:border-[var(--color-accent)]/50 min-w-0 box-border"
        >
          {/* Dynamic Spotlight Effect Layer (Completely unmounted on mobile for instant rendering) */}
          {!isMobile && (
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0 will-change-[opacity]"
              style={{
                background:
                  "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(255, 90, 54, 0.08), transparent 80%)",
              }}
            />
          )}

          <div className="relative z-10 flex flex-col gap-5 sm:gap-6 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2.5 min-w-0">
              <span className="text-[11px] sm:text-xs font-mono px-3 py-1 bg-[var(--color-surface-2)] text-[var(--color-accent)] rounded-full border border-[var(--color-border)] truncate max-w-full">
                {education.period}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[var(--color-text-muted)] truncate max-w-full">
                {education.location}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="text-lg sm:text-2xl font-bold text-[var(--color-text)] tracking-tight flex items-start sm:items-center gap-2.5 break-words">
                <GraduationCap className="text-[var(--color-accent)] shrink-0 mt-1 sm:mt-0" size={24} />
                <span className="break-words">{education.degree}</span>
              </h3>
              <p className="text-[var(--color-accent)] font-mono text-xs sm:text-sm mt-1.5 break-words">
                {education.school}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-2.5 sm:mb-3">
                Curriculum & Coursework
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {education.coursework.map((course: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[11px] sm:text-xs font-mono px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[var(--color-surface-2)] text-[var(--color-text)] rounded-lg border border-[var(--color-border)] font-medium flex items-center gap-1.5 max-w-full truncate"
                  >
                    <BookOpen size={11} className="text-[var(--color-accent)] shrink-0" />
                    <span className="truncate">{course}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2.5 text-[11px] sm:text-xs font-mono min-w-0">
            <span className="text-[var(--color-text)] font-semibold break-words">{education.detail}</span>
            <span className="flex items-center gap-1.5 font-bold shrink-0">
              <span className="text-[var(--color-text-muted)]">status:</span>
              <span className="text-[var(--color-accent)]">GRADUATED • DISTINCTION</span>
            </span>
          </div>
        </div>

        {/* Right Side: Reflective Card Module (Fully lightweight on mobile) */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-w-0 w-full">
          <ReflectiveCard
            className="w-full h-full shadow-xl"
            blurStrength={isMobile ? 0 : 2}
            metalness={isMobile ? 0 : 0.8}
            roughness={0.2}
            displacementStrength={isMobile ? 0 : 10}
            noiseScale={1.2}
            specularConstant={2.0}
            grayscale={0.4}
            glassDistortion={isMobile ? 0 : 4}
            overlayColor="rgba(13, 13, 13, 0.85)"
            color="#f5f1ea"
            style={{ width: '100%', height: '100%', minHeight: isMobile ? 'auto' : '480px' }}
          >
            <div className="flex flex-col h-full justify-between min-w-0 w-full">
              <div className="w-full min-w-0">
                {/* Tab Switcher Headers */}
                <div className="flex items-center gap-2 p-1 bg-black/50 backdrop-blur-sm rounded-xl border border-[var(--color-border)] mb-5 sm:mb-6 font-mono text-[11px] sm:text-xs shadow-inner">
                  <button
                    onClick={() => handleTabChange(0)}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 truncate ${
                      activeTab === 0
                        ? "bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-sm border border-[var(--color-border)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <ShieldCheck size={13} className="shrink-0" />
                    <span className="truncate">Certifications ({certifications.length})</span>
                  </button>
                  <button
                    onClick={() => handleTabChange(1)}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 truncate ${
                      activeTab === 1
                        ? "bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-sm border border-[var(--color-border)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Languages size={13} className="shrink-0" />
                    <span className="truncate">Languages ({languages.length})</span>
                  </button>
                </div>

                {/* Tab 0: Certifications Panel */}
                {activeTab === 0 && (
                  <div className="space-y-2.5 sm:space-y-3 w-full min-w-0">
                    {certifications.map((cert: Certification, idx: number) => {
                      const content = (
                        <div className="flex items-center gap-3 sm:gap-4 group/cert w-full min-w-0">
                          {cert.badgeUrl ? (
                            <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl border border-[var(--color-border)] bg-black/50 p-1.5 sm:p-2 shrink-0 shadow-sm overflow-hidden">
                              <Image
                                src={cert.badgeUrl}
                                alt={`${cert.name} badge`}
                                fill
                                sizes="64px"
                                loading="lazy"
                                className="object-contain p-1"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl border border-[var(--color-border)] bg-black/50 flex items-center justify-center shrink-0 text-[var(--color-accent)]">
                              <Award size={22} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-[var(--color-text)] group-hover/cert:text-[var(--color-accent)] transition-colors leading-snug break-words">
                              {cert.name}
                            </p>
                            <p className="text-[11px] sm:text-xs font-mono text-[var(--color-text-muted)] mt-1 flex items-center gap-1 flex-wrap">
                              <span className="truncate">{cert.issuer}</span>
                              {cert.credentialUrl && <ExternalLink size={11} className="inline opacity-70 shrink-0" />}
                            </p>
                          </div>
                        </div>
                      );

                      return cert.credentialUrl ? (
                        <a
                          key={idx}
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 sm:p-3.5 rounded-xl transition-colors bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-[var(--color-border)]/60 hover:border-[var(--color-accent)]/50 shadow-sm w-full min-w-0 box-border"
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={idx} className="p-3 sm:p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-[var(--color-border)]/60 shadow-sm w-full min-w-0 box-border">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tab 1: Languages Panel */}
                {activeTab === 1 && (
                  <div className="grid grid-cols-1 gap-2.5 w-full min-w-0">
                    {languages.map((lang: Language, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-[var(--color-border)]/60 shadow-sm w-full min-w-0 gap-2 box-border"
                      >
                        <span className="text-xs sm:text-sm font-mono text-[var(--color-text)] font-medium flex items-center gap-2 truncate min-w-0">
                          <Languages size={13} className="text-[var(--color-accent)] shrink-0" />
                          <span className="truncate">{lang.name}</span>
                        </span>
                        <span className="text-[11px] sm:text-xs font-mono px-2 py-1 bg-black/50 text-[var(--color-accent)] rounded border border-[var(--color-border)] shrink-0">
                          {lang.level}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ReflectiveCard>
        </div>
      </div>

      {/* Bottom Full-Width Strip: Achievements Card */}
      <StarBorder
        as="div"
        color="var(--color-accent)"
        speed="6s"
        thickness={2}
        className="w-full rounded-[22px] bg-[var(--color-surface)] max-w-full overflow-hidden box-border"
      >
        <div className="p-4 sm:p-6 bg-[var(--color-surface)] relative overflow-hidden group w-full h-full rounded-[20px] min-w-0 box-border">
          <div className="absolute top-0 right-0 w-28 h-28 bg-[var(--color-accent)]/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-sm sm:text-lg font-bold font-mono text-[var(--color-text)] mb-3.5 sm:mb-4 flex items-center gap-2">
            <Trophy size={16} className="text-[var(--color-accent)] shrink-0" />
            <span className="truncate">Key Achievements & Milestones</span>
          </h3>
          
          <div className="grid grid-cols-1 gap-2.5 sm:gap-3 w-full min-w-0">
            {achievements.map((item: string, idx: number) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-xl bg-[var(--color-surface-2)]/40 border border-[var(--color-border)]/60 flex items-start gap-3 transition-colors duration-200 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-2)] w-full min-w-0 box-border"
                >
                  <span className="text-[var(--color-accent)] font-mono font-bold text-xs sm:text-sm mt-0.5 flex items-center gap-1 shrink-0">
                    {isFirst && <Sparkles size={13} className="animate-pulse" />}
                    #0{idx + 1}
                  </span>
                  <p className="text-[var(--color-text-muted)] text-[11px] sm:text-sm leading-relaxed break-words min-w-0 flex-1">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </StarBorder>
    </section>
  );
}

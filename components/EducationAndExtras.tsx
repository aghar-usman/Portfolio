"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Detect mobile viewport to lighten heavy graphical effects and improve scaling
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.setProperty("--mouse-x", `${x}px`);
    spotlightRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="education" className="py-16 flex flex-col gap-12 w-full max-w-full overflow-hidden box-border">
      <h2 className="text-3xl font-bold font-mono text-[var(--color-text)]">
        education & credentials
      </h2>

      {/* Main Grid: Education & Interactive Credentials Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full min-w-0">
        
        {/* Left Side: Education Terminal Card (7 cols) */}
        <div
          ref={spotlightRef}
          onMouseMove={handleMouseMove}
          className="lg:col-span-7 relative p-5 sm:p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:border-[var(--color-accent)]/50 min-w-0 box-border"
        >
          {/* Dynamic Spotlight Effect Layer (Disabled on mobile for performance) */}
          {!isMobile && (
            <div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
              style={{
                background:
                  "radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255, 90, 54, 0.1), transparent 80%)",
              }}
            />
          )}

          <div className="relative z-10 flex flex-col gap-6 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
              <span className="text-xs font-mono px-3 py-1 bg-[var(--color-surface-2)] text-[var(--color-accent)] rounded-full border border-[var(--color-border)] truncate max-w-full">
                {education.period}
              </span>
              <span className="text-xs font-mono text-[var(--color-text-muted)] truncate max-w-full">
                {education.location}
              </span>
            </div>

            <div className="min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight flex items-start sm:items-center gap-2.5 break-words">
                <GraduationCap className="text-[var(--color-accent)] shrink-0 mt-1 sm:mt-0" size={26} />
                <span className="break-words">{education.degree}</span>
              </h3>
              <p className="text-[var(--color-accent)] font-mono text-sm mt-1.5 break-words">
                {education.school}
              </p>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Curriculum & Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {education.coursework.map((course: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1.5 bg-[var(--color-surface-2)] text-[var(--color-text)] rounded-lg border border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-accent)] hover:text-black hover:border-transparent font-medium flex items-center gap-1.5 group/course max-w-full truncate"
                  >
                    <BookOpen size={12} className="text-[var(--color-accent)] group-hover/course:text-black transition-colors shrink-0" />
                    <span className="truncate">{course}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono min-w-0">
            <span className="text-[var(--color-text)] font-semibold break-words">{education.detail}</span>
            <span className="flex items-center gap-1.5 font-bold shrink-0">
              <span className="text-[var(--color-text-muted)]">status:</span>
              <span className="text-[var(--color-accent)]">GRADUATED • DISTINCTION</span>
            </span>
          </div>
        </div>

        {/* Right Side: Reflective Card (Responsive & Optimized across all screen sizes) */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-w-0 w-full">
          <ReflectiveCard
            className="w-full h-full shadow-2xl"
            blurStrength={isMobile ? 0 : 4}
            metalness={isMobile ? 0.2 : 0.95}
            roughness={0.15}
            displacementStrength={isMobile ? 0 : 18}
            noiseScale={1.2}
            specularConstant={2.5}
            grayscale={0.3}
            glassDistortion={isMobile ? 0 : 8}
            overlayColor="rgba(13, 13, 13, 0.72)"
            color="#f5f1ea"
            style={{ width: '100%', height: '100%', minHeight: '480px' }}
          >
            <div className="flex flex-col h-full justify-between min-w-0 w-full">
              <div className="w-full min-w-0">
                {/* Tab Switcher Headers */}
                <div className="flex items-center gap-2 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-[var(--color-border)] mb-6 font-mono text-xs shadow-inner">
                  <button
                    onClick={() => setActiveTab(0)}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 truncate ${
                      activeTab === 0
                        ? "bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-sm border border-[var(--color-border)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <ShieldCheck size={14} className="shrink-0" />
                    <span className="truncate">Certifications ({certifications.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab(1)}
                    className={`flex-1 py-2 px-2 sm:px-3 rounded-lg transition-all flex items-center justify-center gap-1.5 truncate ${
                      activeTab === 1
                        ? "bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-sm border border-[var(--color-border)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Languages size={14} className="shrink-0" />
                    <span className="truncate">Languages ({languages.length})</span>
                  </button>
                </div>

                {/* Tab 0: Certifications Panel */}
                {activeTab === 0 && (
                  <div className="space-y-3 animate-fadeIn w-full min-w-0">
                    {certifications.map((cert: Certification, idx: number) => {
                      const content = (
                        <div className="flex items-center gap-3 sm:gap-4 group/cert w-full min-w-0">
                          {cert.badgeUrl ? (
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[var(--color-border)] bg-black/50 p-2 shrink-0 shadow-md group-hover/cert:border-[var(--color-accent)] transition-colors overflow-hidden">
                              <Image
                                src={cert.badgeUrl}
                                alt={`${cert.name} badge`}
                                fill
                                sizes="64px"
                                className="object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-[var(--color-border)] bg-black/50 flex items-center justify-center shrink-0 text-[var(--color-accent)]">
                              <Award size={26} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-[var(--color-text)] group-hover/cert:text-[var(--color-accent)] transition-colors leading-snug break-words">
                              {cert.name}
                            </p>
                            <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1 flex items-center gap-1 flex-wrap">
                              <span className="truncate">{cert.issuer}</span>
                              {cert.credentialUrl && <ExternalLink size={12} className="inline opacity-70 shrink-0" />}
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
                          className="block p-3.5 rounded-xl transition-all bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-[var(--color-border)]/60 hover:border-[var(--color-accent)]/50 shadow-sm w-full min-w-0 box-border"
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={idx} className="p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-[var(--color-border)]/60 shadow-sm w-full min-w-0 box-border">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tab 1: Languages Panel */}
                {activeTab === 1 && (
                  <div className="grid grid-cols-1 gap-2.5 animate-fadeIn w-full min-w-0">
                    {languages.map((lang: Language, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-[var(--color-border)]/60 shadow-sm w-full min-w-0 gap-2 box-border"
                      >
                        <span className="text-sm font-mono text-[var(--color-text)] font-medium flex items-center gap-2 truncate min-w-0">
                          <Languages size={14} className="text-[var(--color-accent)] shrink-0" />
                          <span className="truncate">{lang.name}</span>
                        </span>
                        <span className="text-xs font-mono px-2 py-1 bg-black/50 text-[var(--color-accent)] rounded border border-[var(--color-border)] shrink-0">
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
        speed="5s"
        thickness={2}
        className="w-full rounded-[22px] bg-[var(--color-surface)] transition-all duration-300 max-w-full overflow-hidden box-border"
      >
        <div className="p-5 sm:p-6 bg-[var(--color-surface)] relative overflow-hidden group w-full h-full rounded-[20px] min-w-0 box-border">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-base sm:text-lg font-bold font-mono text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-[var(--color-accent)] shrink-0" />
            <span className="truncate">Key Achievements & Milestones</span>
          </h3>
          
          <div className="grid grid-cols-1 gap-3 w-full min-w-0">
            {achievements.map((item: string, idx: number) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface-2)]/40 border border-[var(--color-border)]/60 flex items-start gap-3 transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-2)] w-full min-w-0 box-border"
                >
                  <span className="text-[var(--color-accent)] font-mono font-bold mt-0.5 flex items-center gap-1 shrink-0">
                    {isFirst && <Sparkles size={14} className="animate-pulse" />}
                    #0{idx + 1}
                  </span>
                  <p className="text-[var(--color-text-muted)] text-xs sm:text-sm leading-relaxed break-words min-w-0 flex-1">
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

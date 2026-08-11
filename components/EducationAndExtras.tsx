"use client";

import React, { useRef, useState } from "react";
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
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlightRef.current) return;
    const rect = spotlightRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    spotlightRef.current.style.setProperty("--mouse-x", `${x}px`);
    spotlightRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section id="education" className="py-16 flex flex-col gap-12">
      <h2 className="text-3xl font-bold font-mono text-[var(--color-text)]">
        education & credentials
      </h2>

      {/* Main Grid: Education & Interactive Credentials Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Education Terminal Card (7 cols) */}
        <div
          ref={spotlightRef}
          onMouseMove={handleMouseMove}
          className="lg:col-span-7 relative p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden group flex flex-col justify-between transition-all duration-300 hover:border-[var(--color-accent)]/50"
        >
          {/* Dynamic Spotlight Effect Layer */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
            style={{
              background:
                "radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(255, 90, 54, 0.1), transparent 80%)",
            }}
          />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-mono px-3 py-1 bg-[var(--color-surface-2)] text-[var(--color-accent)] rounded-full border border-[var(--color-border)]">
                {education.period}
              </span>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                {education.location}
              </span>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[var(--color-text)] tracking-tight flex items-center gap-2.5">
                <GraduationCap className="text-[var(--color-accent)] shrink-0" size={26} />
                <span>{education.degree}</span>
              </h3>
              <p className="text-[var(--color-accent)] font-mono text-sm mt-1.5">
                {education.school}
              </p>
            </div>

            <div>
              <p className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                Curriculum & Coursework
              </p>
              <div className="flex flex-wrap gap-2">
                {education.coursework.map((course: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-3 py-1.5 bg-[var(--color-surface-2)] text-[var(--color-text)] rounded-lg border border-[var(--color-border)] transition-all duration-200 hover:bg-[var(--color-accent)] hover:text-black hover:border-transparent font-medium flex items-center gap-1.5 group/course"
                  >
                    <BookOpen size={12} className="text-[var(--color-accent)] group-hover/course:text-black transition-colors" />
                    <span>{course}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <span className="text-[var(--color-text)] font-semibold">{education.detail}</span>
            <span className="flex items-center gap-1.5 font-bold">
              <span className="text-[var(--color-text-muted)]">status:</span>
              <span className="text-[var(--color-accent)]">GRADUATED • DISTINCTION</span>
            </span>
          </div>
        </div>

        {/* Right Side: Reflective Card Applied to Certifications & Languages Module (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <ReflectiveCard
            className="w-full h-full shadow-2xl"
            blurStrength={4}
            metalness={0.95}
            roughness={0.15}
            displacementStrength={18}
            noiseScale={1.2}
            specularConstant={2.5}
            grayscale={0.3}
            glassDistortion={8}
            overlayColor="rgba(13, 13, 13, 0.72)"
            color="#f5f1ea"
            style={{ maxWidth: '100%', height: '100%', minHeight: '480px' }}
          >
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Tab Switcher Headers */}
                <div className="flex items-center gap-2 p-1 bg-black/40 backdrop-blur-md rounded-xl border border-[var(--color-border)] mb-6 font-mono text-xs shadow-inner">
                  <button
                    onClick={() => setActiveTab(0)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      activeTab === 0
                        ? "bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-sm border border-[var(--color-border)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <ShieldCheck size={14} />
                    <span>Certifications ({certifications.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab(1)}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                      activeTab === 1
                        ? "bg-[var(--color-surface)] text-[var(--color-accent)] font-bold shadow-sm border border-[var(--color-border)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Languages size={14} />
                    <span>Languages ({languages.length})</span>
                  </button>
                </div>

                {/* Tab 0: Certifications Panel */}
                {activeTab === 0 && (
                  <div className="space-y-3 animate-fadeIn">
                    {certifications.map((cert: Certification, idx: number) => {
                      const content = (
                        <div className="flex items-center gap-4 group/cert">
                          {cert.badgeUrl ? (
                            <div className="relative w-16 h-16 rounded-xl border border-[var(--color-border)] bg-black/50 p-2 shrink-0 shadow-md group-hover/cert:border-[var(--color-accent)] transition-colors overflow-hidden">
                              <Image
                                src={cert.badgeUrl}
                                alt={`${cert.name} badge`}
                                fill
                                sizes="64px"
                                className="object-contain p-2"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-xl border border-[var(--color-border)] bg-black/50 flex items-center justify-center shrink-0 text-[var(--color-accent)]">
                              <Award size={28} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[var(--color-text)] group-hover/cert:text-[var(--color-accent)] transition-colors leading-snug">
                              {cert.name}
                            </p>
                            <p className="text-xs font-mono text-[var(--color-text-muted)] mt-1 flex items-center gap-1">
                              <span>{cert.issuer}</span>
                              {cert.credentialUrl && <ExternalLink size={12} className="inline opacity-70" />}
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
                          className="block p-3.5 rounded-xl transition-all bg-black/30 backdrop-blur-sm hover:bg-black/50 border border-[var(--color-border)]/60 hover:border-[var(--color-accent)]/50 shadow-sm"
                        >
                          {content}
                        </a>
                      ) : (
                        <div key={idx} className="p-3.5 rounded-xl bg-black/30 backdrop-blur-sm border border-[var(--color-border)]/60 shadow-sm">
                          {content}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tab 1: Languages Panel */}
                {activeTab === 1 && (
                  <div className="grid grid-cols-1 gap-2.5 animate-fadeIn">
                    {languages.map((lang: Language, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-black/30 backdrop-blur-sm border border-[var(--color-border)]/60 shadow-sm"
                      >
                        <span className="text-sm font-mono text-[var(--color-text)] font-medium flex items-center gap-2">
                          <Languages size={14} className="text-[var(--color-accent)]" />
                          {lang.name}
                        </span>
                        <span className="text-xs font-mono px-2 py-1 bg-black/50 text-[var(--color-accent)] rounded border border-[var(--color-border)]">
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

      {/* Bottom Full-Width Strip: Achievements Card Wrapped in StarBorder */}
      <StarBorder
        as="div"
        color="var(--color-accent)"
        speed="5s"
        thickness={2}
        className="w-full rounded-[22px] bg-[var(--color-surface)] transition-all duration-300"
      >
        <div className="p-6 bg-[var(--color-surface)] relative overflow-hidden group w-full h-full rounded-[20px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-lg font-bold font-mono text-[var(--color-text)] mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-[var(--color-accent)]" />
            Key Achievements & Milestones
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {achievements.map((item: string, idx: number) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[var(--color-surface-2)]/40 border border-[var(--color-border)]/60 flex items-start gap-3 transition-all duration-300 hover:border-[var(--color-accent)]/40 hover:bg-[var(--color-surface-2)]"
                >
                  <span className="text-[var(--color-accent)] font-mono font-bold mt-0.5 flex items-center gap-1">
                    {isFirst && <Sparkles size={14} className="animate-pulse" />}
                    #0{idx + 1}
                  </span>
                  <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
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
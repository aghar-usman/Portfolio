"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import "./GooeyNav.css";

interface NavItem {
  label: string;
  href: string;
}

interface GooeyNavProps {
  items: NavItem[];
  particleCount?: number;
  particleDistances?: [number, number];
  initialActiveIndex?: number;
  animationTime?: number;
  timeVariance?: number;
  colors?: number[];
  className?: string;
}

export default function GooeyNav({
  items,
  particleCount = 15,
  particleDistances = [90, 10],
  initialActiveIndex = 0,
  animationTime = 1100, // Increased base time by ~500ms for a smoother, slower feel
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  className = "",
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  const activeItemRef = useRef<HTMLLIElement | null>(null);

  const makeParticles = useCallback(
    (element: HTMLElement) => {
      const existingParticles = element.querySelectorAll(".particle");
      existingParticles.forEach((p) => p.remove());

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("span");
        particle.classList.add("particle");

        const colorIndex = colors[Math.floor(Math.random() * colors.length)];
        particle.classList.add(`color-${colorIndex}`);

        const randomAngle = Math.random() * Math.PI * 2;
        const distance =
          particleDistances[0] +
          Math.random() * (particleDistances[1] - particleDistances[0]);

        const endX = Math.cos(randomAngle) * distance;
        const endY = Math.sin(randomAngle) * distance;

        const startX = (Math.random() - 0.5) * 20;
        const startY = (Math.random() - 0.5) * 20;

        const scale = 0.5 + Math.random() * 1;
        const rotate = (Math.random() - 0.5) * 360;
        const time = animationTime + (Math.random() - 0.5) * timeVariance;

        particle.style.setProperty("--start-x", `${startX}px`);
        particle.style.setProperty("--start-y", `${startY}px`);
        particle.style.setProperty("--end-x", `${endX}px`);
        particle.style.setProperty("--end-y", `${endY}px`);
        particle.style.setProperty("--scale", `${scale}`);
        particle.style.setProperty("--rotate", `${rotate}deg`);
        particle.style.setProperty("--time", `${time}ms`);

        const point = document.createElement("span");
        point.classList.add("point");
        particle.appendChild(point);

        element.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, time);
      }
    },
    [particleCount, particleDistances, colors, animationTime, timeVariance]
  );

  const updateEffectPosition = useCallback(
    (element: HTMLLIElement, animate: boolean = true) => {
      if (!containerRef.current || !filterRef.current || !textRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const targetRect = element.getBoundingClientRect();

      const left = targetRect.left - containerRect.left;
      const top = targetRect.top - containerRect.top;
      const width = targetRect.width;
      const height = targetRect.height;

      const applyStyles = (el: HTMLElement) => {
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.transform = `translate(${left}px, ${top}px)`;
      };

      applyStyles(filterRef.current);
      applyStyles(textRef.current);

      if (animate) {
        filterRef.current.classList.remove("active");
        textRef.current.classList.remove("active");

        void filterRef.current.offsetWidth;

        filterRef.current.classList.add("active");
        textRef.current.classList.add("active");

        makeParticles(filterRef.current);
      }
    },
    [makeParticles]
  );

  useEffect(() => {
    if (!navRef.current) return;
    const itemsList = navRef.current.querySelectorAll("li");
    if (itemsList[activeIndex]) {
      activeItemRef.current = itemsList[activeIndex] as HTMLLIElement;
      updateEffectPosition(activeItemRef.current, false);
    }
  }, [activeIndex, updateEffectPosition]);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    setActiveIndex(index);
    updateEffectPosition(e.currentTarget, true);
  };

  return (
    <div ref={containerRef} className={`gooey-nav-container ${className}`}>
      <nav ref={navRef} className="gooey-nav">
        <ul>
          {items.map((item, index) => (
            <li
              key={index}
              className={activeIndex === index ? "active" : ""}
              onClick={(e) => handleClick(e, index)}
            >
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div ref={filterRef} className="effect filter"></div>

      <div ref={textRef} className="effect text">
        {items[activeIndex]?.label}
      </div>
    </div>
  );
}
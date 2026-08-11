"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import "./FoldText.css";

type SplitBy = "char" | "word" | "line";
type Hinge = "top" | "bottom" | "left" | "right";

export interface FoldTextProps {
  text?: string;
  splitBy?: SplitBy;
  hinge?: Hinge;

  duration?: number;
  stagger?: number;
  ease?: string;
  perspective?: number;
  creaseShading?: number;

  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;

  className?: string;
  style?: CSSProperties;
}

type HingeConfig = {
  origin: string;
  rotateX: number;
  rotateY: number;
};

const HINGE_CONFIG: Record<Hinge, HingeConfig> = {
  top: {
    origin: "50% 0%",
    rotateX: -92,
    rotateY: 0,
  },
  bottom: {
    origin: "50% 100%",
    rotateX: 92,
    rotateY: 0,
  },
  left: {
    origin: "0% 50%",
    rotateX: 0,
    rotateY: 92,
  },
  right: {
    origin: "100% 50%",
    rotateX: 0,
    rotateY: -92,
  },
};

const clamp = (
  value: number,
  min: number,
  max: number
): number => {
  return Math.min(max, Math.max(min, value));
};

const renderWhitespace = (
  value: string,
  key: string
): ReactNode[] => {
  return value.split(/(\n)/).map((part, index) => {
    if (part === "\n") {
      return <br key={`${key}-br-${index}`} />;
    }

    if (!part) {
      return null;
    }

    return (
      <span
        className="fold-text-whitespace"
        key={`${key}-space-${index}`}
      >
        {part.replace(/ /g, "\u00A0")}
      </span>
    );
  });
};

const FoldText = ({
  text = "Design unfolds",
  splitBy = "char",
  hinge = "top",

  duration = 0.65,
  stagger = 0.045,
  ease = "power3.out",
  perspective = 700,
  creaseShading = 0.55,

  fontSize = "clamp(2rem, 5vw, 5rem)",
  fontWeight = 800,
  color = "#f7f2e8",

  className = "",
  style = {},
}: FoldTextProps) => {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const hingeConfig =
    HINGE_CONFIG[hinge] ?? HINGE_CONFIG.top;

  const safeCrease = clamp(creaseShading, 0, 1);
  const safePerspective = Math.max(120, perspective);

  /*
   * Create the individual fold panels.
   */
  const segments = useMemo(() => {
    let segmentIndex = 0;

    const renderSegment = (
      content: string,
      key: string,
      split: SplitBy = splitBy
    ): ReactNode => {
      segmentIndex += 1;

      return (
        <span
          className="fold-text-segment"
          data-fold-split={split}
          key={key}
          style={
            {
              "--fold-perspective": `${safePerspective}px`,
            } as CSSProperties
          }
        >
          <span
            className="fold-text-piece"
            data-fold-hinge={hinge}
            style={
              {
                transformOrigin: hingeConfig.origin,
                "--fold-crease": 0,
              } as CSSProperties
            }
          >
            {content || "\u00A0"}
          </span>
        </span>
      );
    };

    /*
     * LINE mode
     */
    if (splitBy === "line") {
      return text.split("\n").map((line, index) => (
        <span
          className="fold-text-line"
          key={`line-${index}`}
        >
          {renderSegment(
            line || "\u00A0",
            `segment-line-${index}`,
            "line"
          )}
        </span>
      ));
    }

    /*
     * WORD mode
     */
    if (splitBy === "word") {
      return text
        .split(/(\s+)/)
        .flatMap((part, index) => {
          if (!part) {
            return [];
          }

          if (/^\s+$/.test(part)) {
            return renderWhitespace(
              part,
              `ws-${index}`
            );
          }

          return renderSegment(
            part,
            `segment-word-${segmentIndex}`,
            "word"
          );
        });
    }

    /*
     * CHARACTER mode
     */
    return Array.from(text).map((char, index) => {
      if (char === "\n") {
        return <br key={`br-${index}`} />;
      }

      return renderSegment(
        char === " " ? "\u00A0" : char,
        `segment-char-${index}`,
        "char"
      );
    });
  }, [
    text,
    splitBy,
    hinge,
    safePerspective,
    hingeConfig.origin,
  ]);

  /*
   * Main animation.
   */
  const playFoldAnimation = useCallback(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const pieces = Array.from(
      root.querySelectorAll<HTMLElement>(
        ".fold-text-piece"
      )
    );

    if (!pieces.length) {
      return;
    }

    timelineRef.current?.kill();
    gsap.killTweensOf(pieces);

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const activeDuration = reduceMotion
      ? Math.min(duration, 0.2)
      : duration;

    const activeStagger = reduceMotion
      ? 0
      : stagger;

    gsap.set(pieces, {
      opacity: 0,
      rotateX: reduceMotion
        ? 0
        : hingeConfig.rotateX,
      rotateY: reduceMotion
        ? 0
        : hingeConfig.rotateY,
      transformOrigin: hingeConfig.origin,
      "--fold-crease": reduceMotion
        ? 0
        : safeCrease,
      force3D: true,
    });

    const timeline = gsap.timeline();

    timeline.to(pieces, {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      "--fold-crease": 0,
      duration: activeDuration,
      stagger: activeStagger,
      ease: reduceMotion
        ? "power1.out"
        : ease,
      force3D: true,
      clearProps: "willChange",
    });

    timelineRef.current = timeline;
  }, [
    duration,
    stagger,
    ease,
    hingeConfig.rotateX,
    hingeConfig.rotateY,
    hingeConfig.origin,
    safeCrease,
  ]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const initialTimer = window.setTimeout(() => {
      playFoldAnimation();
    }, 80);

    const handleMouseEnter = () => {
      playFoldAnimation();
    };

    root.addEventListener(
      "mouseenter",
      handleMouseEnter
    );

    return () => {
      window.clearTimeout(initialTimer);

      root.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );

      timelineRef.current?.kill();
      timelineRef.current = null;

      const pieces = Array.from(
        root.querySelectorAll<HTMLElement>(
          ".fold-text-piece"
        )
      );

      gsap.killTweensOf(pieces);
    };
  }, [playFoldAnimation]);

  const rootStyle: CSSProperties = {
    "--fold-text-font-size":
      typeof fontSize === "number"
        ? `${fontSize}px`
        : fontSize,

    "--fold-text-font-weight": fontWeight,

    "--fold-text-color": color,

    ...style,
  } as CSSProperties;

  return (
    <span
      ref={rootRef}
      className={`fold-text ${className}`.trim()}
      style={rootStyle}
    >
      {/* Accessible text */}
      <span className="fold-text-sr-only">
        {text}
      </span>

      {/* Animated visual */}
      <span
        className="fold-text-visual"
        aria-hidden="true"
      >
        {segments}
      </span>
    </span>
  );
};

export default FoldText;

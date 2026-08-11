"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import "./TextType.css";

interface TextTypeProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: {
    min: number;
    max: number;
  };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 50,
  pauseDuration = 20000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  );

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) {
      return typingSpeed;
    }

    const { min, max } = variableSpeed;

    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = useCallback(() => {
    if (textColors.length === 0) {
      return "inherit";
    }

    return textColors[currentTextIndex % textColors.length];
  }, [textColors, currentTextIndex]);

  /*
   * Start animation when the component becomes visible.
   */
  useEffect(() => {
    if (!startOnVisible || !containerRef.current) {
      return;
    }

    const currentContainer = containerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(currentContainer);

    return () => {
      observer.disconnect();
    };
  }, [startOnVisible]);

  /*
   * Cursor blinking animation.
   */
  useEffect(() => {
    if (!showCursor || !cursorRef.current) {
      return;
    }

    const cursor = cursorRef.current;

    gsap.killTweensOf(cursor);

    gsap.set(cursor, {
      opacity: 1,
    });

    gsap.to(cursor, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    });

    return () => {
      gsap.killTweensOf(cursor);
    };
  }, [showCursor, cursorBlinkDuration]);

  /*
   * Main typewriter animation.
   *
   * Flow:
   *
   * 1. Type text
   * 2. Keep text static for 20 seconds
   * 3. Delete text
   * 4. Start typing again
   */
  useEffect(() => {
    if (!isVisible) {
      return;
    }

    let timeout: ReturnType<typeof setTimeout> | undefined;

    const currentText = textArray[currentTextIndex] ?? "";

    const processedText = reverseMode
      ? currentText.split("").reverse().join("")
      : currentText;

    /*
     * PHASE 1
     *
     * Type one character at a time.
     */
    if (!isDeleting && currentCharIndex < processedText.length) {
      timeout = setTimeout(
        () => {
          setDisplayedText(
            (previousText) =>
              previousText + processedText[currentCharIndex]
          );

          setCurrentCharIndex(
            (previousIndex) => previousIndex + 1
          );
        },
        variableSpeed ? getRandomSpeed() : typingSpeed
      );

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }

    /*
     * PHASE 2
     *
     * Text is completely typed.
     *
     * Keep it visible for 20 seconds.
     */
    if (
      !isDeleting &&
      currentCharIndex >= processedText.length
    ) {
      if (
        !loop &&
        currentTextIndex === textArray.length - 1
      ) {
        return;
      }

      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseDuration);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }

    /*
     * PHASE 3
     *
     * Delete one character at a time.
     */
    if (isDeleting && displayedText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedText((previousText) =>
          previousText.slice(0, -1)
        );

        setCurrentCharIndex(
          (previousIndex) => Math.max(0, previousIndex - 1)
        );
      }, deletingSpeed);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }

    /*
     * PHASE 4
     *
     * Text has been completely deleted.
     *
     * Schedule the state transition instead of updating
     * state synchronously inside the effect.
     */
    if (isDeleting && displayedText.length === 0) {
      timeout = setTimeout(() => {
        onSentenceComplete?.(
          currentText,
          currentTextIndex
        );

        setIsDeleting(false);

        setCurrentCharIndex(0);

        setCurrentTextIndex(
          (previousIndex) =>
            (previousIndex + 1) % textArray.length
        );
      }, 0);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    isVisible,
    reverseMode,
    variableSpeed,
    getRandomSpeed,
    onSentenceComplete,
  ]);

  const currentText = textArray[currentTextIndex] ?? "";

  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < currentText.length || isDeleting);

  return (
    <Component
      ref={containerRef}
      className={`text-type ${className}`}
      {...props}
    >
      <span
        className="text-type__content"
        style={{
          color: getCurrentTextColor(),
        }}
      >
        {displayedText}
      </span>

      {showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${cursorClassName}${
            shouldHideCursor
              ? " text-type__cursor--hidden"
              : ""
          }`}
        >
          {cursorCharacter}
        </span>
      )}
    </Component>
  );
};

export default TextType;
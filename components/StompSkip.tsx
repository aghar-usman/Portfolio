"use client";

import { useEffect, useState } from "react";
import { stompIntro } from "@/data";

export default function StompSkip() {
  const [available, setAvailable] = useState(true);
  useEffect(() => {
    const clear = () => setAvailable(false);
    window.addEventListener(stompIntro.cutEvent, clear);
    window.addEventListener(stompIntro.endedEvent, clear);
    const root = document.documentElement;
    if (!root.hasAttribute("data-stomp-pending") && !root.hasAttribute("data-stomp-playing")) clear();
    return () => {
      window.removeEventListener(stompIntro.cutEvent, clear);
      window.removeEventListener(stompIntro.endedEvent, clear);
    };
  }, []);
  return available ? <button type="button" className="stomp-skip" id="stomp-skip">{stompIntro.skip}</button> : null;
}

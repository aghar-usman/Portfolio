import { stompIntro } from "@/data";

// Run in the document head so ineligible visits never receive an overlay.
export const stompBoot = `(() => {
  const config = ${JSON.stringify(stompIntro)};
  const debug = ${process.env.NODE_ENV !== "production"} && new URLSearchParams(location.search).has('introDebug');
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  try {
    if (!debug && (location.hash || sessionStorage.getItem(config.sessionKey) || reduced.matches ||
        navigator.webdriver || navigator.connection?.saveData ||
        (document.referrer && new URL(document.referrer).origin === location.origin))) return;
  } catch { return; }

  root.setAttribute('data-stomp-pending', '');
  root.setAttribute('data-stomp-lock', '');
  if (debug) root.setAttribute('data-stomp-debug', '');
  let paintTime = performance.getEntriesByName('first-paint')[0]?.startTime;
  let decodedAt;
  let paintObserver;
  let deadline;
  let stopped = false;
  const events = ['pointerdown', 'click', 'keydown', 'touchstart', 'wheel', 'scroll'];
  const guard = setTimeout(cancel, 1400);

  function tearDown() {
    stopped = true;
    clearTimeout(guard);
    clearTimeout(deadline);
    paintObserver?.disconnect();
    for (const event of events) window.removeEventListener(event, interrupt, true);
    window.removeEventListener(config.startedEvent, tearDown);
    reduced.removeEventListener('change', cancel);
  }
  function cancel() {
    if (stopped) return;
    tearDown();
    root.removeAttribute('data-stomp-pending');
    root.removeAttribute('data-stomp-ready');
    root.removeAttribute('data-stomp-lock');
    window.dispatchEvent(new Event(config.endedEvent));
  }
  function interrupt(event) {
    if (debug) return;
    if (event.type === 'keydown' && event.key === 'Tab' && document.activeElement?.id !== 'stomp-skip') return;
    cancel();
  }
  function admit() {
    if (stopped || decodedAt === undefined || paintTime === undefined) return;
    if (decodedAt > paintTime + config.decodeWindow) { cancel(); return; }
    clearTimeout(deadline);
    root.setAttribute('data-stomp-ready', '');
    window.dispatchEvent(new Event(config.readyEvent));
  }
  function firstPaint(time) {
    if (stopped) return;
    paintTime = time;
    deadline = setTimeout(cancel, Math.max(0, time + config.decodeWindow - performance.now()));
    admit();
  }

  for (const event of events) window.addEventListener(event, interrupt, { capture: true, passive: true });
  window.addEventListener(config.startedEvent, tearDown, { once: true });
  reduced.addEventListener('change', cancel, { once: true });
  if (paintTime !== undefined) firstPaint(paintTime);
  else if (window.PerformanceObserver?.supportedEntryTypes?.includes('paint')) {
    paintObserver = new PerformanceObserver(list => {
      const paint = list.getEntries().find(entry => entry.name === 'first-paint');
      if (!paint) return;
      paintObserver.disconnect();
      firstPaint(paint.startTime);
    });
    paintObserver.observe({ type: 'paint', buffered: true });
  } else requestAnimationFrame(() => requestAnimationFrame(() => firstPaint(performance.now())));

  Promise.all(config.assets.map(name => {
    const image = new Image();
    image.src = '/character/' + name + '.webp';
    return image.decode();
  })).then(() => {
    decodedAt = performance.now();
    admit();
  }, cancel);
})();`;

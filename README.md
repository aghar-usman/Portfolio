# Aghar Usman K T — portfolio

A six-section portfolio that follows one request through UI, API, and data. Built with Next.js 16, React 19, TypeScript, CSS, and GSAP ScrollTrigger.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Page structure

- **About:** introduction and character greeting
- **Stack:** UI, API, and Data layers
- **Experience:** interactive text-to-SQL demo and Team Thai work
- **Projects:** SU·EN Studio, this portfolio, and AgriLeaf Pro
- **Education:** degree, coursework, achievement, and languages
- **Contact:** email, résumé, LinkedIn, and GitHub

The site follows the visitor's preferred color scheme on first load. The theme and reduced-motion controls save a local preference. Desktop scroll movement is disabled for small screens and reduced-motion visitors. The demo uses clearly labeled fictional records.

## Media

The supplied six WebM character clips live in `public/character`. Their encoded frames contain opaque light backgrounds. The browser renders them to a small canvas and removes only the background connected to the video edge. The character greets on load, traces mouse movement, looks toward the pointer, and reacts to clicks or keyboard focus. It has no speech bubble, and scrolling does not trigger it. For the cleanest silhouette on every browser, replace these files with exports that have real alpha and the same crop and anchor. The old loader was removed so visitors reach the work without a waiting screen.

Project and contact copy is in `data/index.ts`. The page implementation is in `components/Portfolio.tsx`; visual tokens and responsive layout are in `app/globals.css`.

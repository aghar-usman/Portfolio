# AUKT. — Developer Portfolio

Aghar Usman K T’s portfolio: React interfaces, Python APIs, and the work that connects them.

[Visit the portfolio](https://aghar-portfolio.vercel.app/) · [LinkedIn](https://linkedin.com/in/aghar-usmankt) · [GitHub](https://github.com/aghar-usman)

## Inside the site

- **Introduction:** an illustrated hero, responsive navigation, and light/dark themes.
- **Selected work:** SU·EN Studio, this portfolio, and AgriLeaf Pro, introduced by a paper-tear transition.
- **Skills:** a plotter-dot animation that organizes individual tools into a readable grid, with instant reveal and replay.
- **Experience:** Team Thai internship details and an interactive journey from a plain-English question to SQL and a result.
- **Education:** degree, coursework, achievement, and languages.
- **Contact:** email, résumé, LinkedIn, and GitHub.

The ERP playground uses **fictional records and deterministic local rules**. It does not access Team Thai systems, execute SQL, or call a live language model.

## Stack

Next.js 16 App Router · React 19 · TypeScript · CSS Modules · GSAP/ScrollTrigger · Lenis · Motion · Anime.js · Remotion Player · Lucide and React Icons.

DM Serif Display, Space Grotesk, and Syne form the main type system; Caveat appears in small handwritten accents. The palette pairs cream and charcoal surfaces with brand blue and restrained warm details.

## Run locally

Requires a Node.js version supported by the installed Next.js release.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
npm run lint
npx tsc --noEmit
node --test tests/request-playground.test.mjs
```

The request tests use Node’s native TypeScript support; use Node 22.18+ or a current supported release. For a webpack build, run `npm run build -- --webpack`.

## Project map

| Location | Purpose |
| --- | --- |
| `data/index.ts` | Profile, projects, education, and contact information |
| `data/requestPlayground.ts` | Local request simulation and sample orders |
| `components/Portfolio.tsx` | Page composition |
| `components/HeroStudy.tsx` | Hero, navigation, and portrait interaction |
| `components/SelectedWork.tsx` | Project previews and paper tear |
| `components/StackPlotter.tsx` | Skills drawing and organized layout |
| `components/ExperienceLab.tsx` | Interactive ERP walkthrough |
| `components/RequestJourney.tsx` | Frame-driven request motion graphic |
| `components/EducationContact.tsx` | Education and contact |
| `app/portfolio-theme.css` | Semantic light/dark palette |
| `app/design-tokens.css` | Shared layout, focus, and timing tokens |
| `public/portraits/` | Full-resolution portrait assets |
| `DESIGN.md` | Visual and interaction conventions |

## Interaction and accessibility

Native links and buttons, keyboard focus indicators, labeled icon controls, mobile menu Escape handling, and live feedback support the main flows. System reduced-motion preferences bypass expressive transitions and smooth scrolling. Touch scrolling stays native. Portrait originals are preserved alongside the illustrated pin variants.

## Credits

See [THIRD_PARTY_CREDITS.md](THIRD_PARTY_CREDITS.md) for interaction sources. Technology marks come from Simple Icons and Remix Icon. Project imagery, studio identity, and third-party marks remain the property of their respective owners.

<!-- Portfolio README · Charcoal / warm white / orange -->
<div align="center">

<a href="https://aghar-portfolio.vercel.app/">
  <img src="docs/readme-banner.svg" width="100%" alt="Aghar Usman K T — Web interfaces. Python backends." />
</a>

<a href="https://aghar-portfolio.vercel.app/">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&amp;weight=500&amp;size=17&amp;duration=2600&amp;pause=1400&amp;color=FF744F&amp;center=true&amp;vCenter=true&amp;width=700&amp;height=52&amp;lines=Interfaces+up+front.+Python+underneath.;React+%2F+Next.js+%2F+TypeScript;Let%27s+build+something+extraordinary+together." width="700" alt="Interfaces up front. Python underneath. Let’s build something extraordinary together." />
</a>

# Developer portfolio

A single page for my projects, experience and the tools behind the work.  
Built with **Next.js**, **React**, **TypeScript** and **Tailwind CSS**.

[![View portfolio](https://img.shields.io/badge/View_Portfolio-%E2%86%97-ff744f?style=for-the-badge&logo=vercel&logoColor=17110d&labelColor=151713)](https://aghar-portfolio.vercel.app/)
[![View résumé](https://img.shields.io/badge/View_R%C3%A9sum%C3%A9-PDF-f2f0e9?style=for-the-badge&labelColor=151713)](https://aghar-portfolio.vercel.app/resume.pdf)
[![Get in touch](https://img.shields.io/badge/Get_in_touch-Email-ff744f?style=for-the-badge&labelColor=151713)](mailto:agharusman529@gmail.com)

<br />

![Next.js](https://img.shields.io/badge/Next.js-151713?style=flat-square&logo=nextdotjs&logoColor=f2f0e9)
![React](https://img.shields.io/badge/React-151713?style=flat-square&logo=react&logoColor=61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-151713?style=flat-square&logo=typescript&logoColor=3178c6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-151713?style=flat-square&logo=tailwindcss&logoColor=06b6d4)
![Vercel](https://img.shields.io/badge/Vercel-151713?style=flat-square&logo=vercel&logoColor=f2f0e9)

<br />

**[Experience](#the-experience) · [Projects](#selected-projects) · [Setup](#run-locally) · [Customization](#make-it-yours)**

</div>

<!-- Add a real portfolio screenshot here when available. -->

---
## The experience

**01 / Explore the page**

A charcoal canvas, warm typography and orange details carry through the whole page. Motion responds to a purpose: navigating the work, exploring the stack, or making contact.

| Section | What happens |
| :--- | :--- |
| **Introduction** | A staged entrance introduces the name, followed by the work and stack. Orange contour lines bend around the pointer, then settle. |
| **Navigation** | A sticky header tracks the current section and document progress. Mobile navigation opens into a full-screen menu. |
| **Stack** | A scroll-linked heading highlight leads into a responsive grid of skill groups. The lists stay visible. |
| **Experience** | A timeline-style layout pairs role details with complete, numbered contributions. |
| **Projects** | Project links, technology lists and expandable implementation details. Optional screenshots use real supplied images. |
| **Background** | Education, coursework, languages and achievements, with certifications shown when supplied. |
| **Contact** | Email, clipboard copying, professional profiles, résumé access and a return to the introduction. |

<details>
<summary><strong>Try the page compass</strong></summary>

The floating control ties the sections together:

1. Scroll to watch the orange ring track your progress.
2. Open the dial to see the section map.
3. Choose a section or use **Previous** and **Next**.
4. Press **Escape** to close the guide.

On smaller screens, the control becomes a compact numbered dial. Navigation uses native browser scrolling and moves keyboard focus to the destination heading.

</details>

<details>
<summary><strong>Motion, keyboard and accessibility</strong></summary>

- Reduced-motion preferences disable the moving background, scroll progress stroke and animated transitions.
- Touch screens receive a static contour background.
- A skip link leads directly to the main content.
- The mobile menu supports Escape, keyboard focus containment and focus restoration.
- Project disclosures use native HTML `<details>` controls.
- Copy-email feedback is announced through a polite live region; success appears only after the clipboard write succeeds.
- The page guide is non-modal and leaves normal page navigation available.

These are implementation choices, rather than a claim of formal accessibility conformance.

</details>

## Selected projects

**02 / Work in focus**

### SU·EN Studio

An architecture and design studio website with a project archive, individual project pages, full-screen galleries and theme switching.

`Next.js` `TypeScript` `Tailwind CSS` `Framer Motion` `GSAP` `Vercel`

**[Visit the website ↗](https://suen-studio.vercel.app/)**

### Personal Portfolio

This portfolio brings the stack, experience, projects and education into one page, driven by a shared content configuration.

`Next.js` `React` `TypeScript` `Tailwind CSS`

**[Visit the portfolio ↗](https://aghar-portfolio.vercel.app/)**

### AgriLeaf Pro

Plant disease detection combining a CNN, a Flask API, OpenCV preprocessing and a ThingSpeak pipeline for soil data.

`Python` `TensorFlow` `Flask` `OpenCV` `ThingSpeak` `GCP`

**[View source ↗](https://github.com/aghar-usman/Leaf-Disease-Detection-using-CNN)**

## Run locally

**03 / Start building**

From the repository root, with Node.js and npm installed:

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000), or the address printed by Next.js.

For a production build:

```bash
npm run build
npm run start
```

These commands assume the standard Next.js scripts in `package.json`. Use the repository’s lockfile and package manager if they differ.

## Make it yours

**04 / Content & design**

### Content

The `@/data` module supplies the profile, contacts, skill groups, experience, projects, education, certifications, achievements, languages and navigation links.

Update that content first. Keep Skills connected to the shared configuration:

```tsx
<Skills skills={skillGroups} />
```

<details>
<summary><strong>Add a project screenshot</strong></summary>

Place a real screenshot in `public/images/`, then add this field to its project entry:

```ts
screenshot: {
  src: "/images/suen-studio.webp",
  alt: "SU·EN Studio homepage showing the architecture project gallery",
},
```

If the content module has its own `ProjectEntry` interface, add:

```ts
screenshot?: { src: string; alt: string };
```

A desktop capture around **1440 × 900** works well. Crop out browser chrome and private information. Screenshots are optional; projects without them render without empty image frames.

</details>

<details>
<summary><strong>Change the theme</strong></summary>

![Portfolio color palette](docs/readme-palette.svg)

The shared tokens live in the global stylesheet:

| Token | Value | Purpose |
| :--- | :--- | :--- |
| `--color-bg` | `#0c0d0c` | Main charcoal background |
| `--color-surface` | `#151713` | Alternating sections and controls |
| `--color-surface-2` | `#20231d` | Secondary surfaces |
| `--color-border` | `#30322d` | Dividers and outlines |
| `--color-accent` | `#ff744f` | Orange actions and highlights |
| `--color-text` | `#f2f0e9` | Warm primary text |
| `--color-text-muted` | `#a5a69d` | Supporting text |

Inter and JetBrains Mono are preferred when already loaded; system fonts provide fallbacks. Set `--site-header-height` to the actual navbar height; the default is `80px`.

</details>

<details>
<summary><strong>Understand the layout</strong></summary>

```text
Home
├── Navbar
├── main
│   ├── Hero
│   ├── Skills
│   ├── Experience
│   ├── Projects
│   └── EducationAndExtras
├── Footer / Contact
└── PageGuide
```

Each section owns its maximum width, responsive gutters and vertical spacing. The page wrapper stays full-width, so alternating backgrounds reach the viewport edges. Avoid adding another narrow container or large gaps around these sections.

The current interaction layer uses native browser APIs and React. Motion libraries listed for showcased projects describe those projects; the redesigned portfolio controls do not require installing a new animation package.

</details>

## Before publishing

- [ ] Confirm all contact, project and credential URLs.
- [ ] Place the résumé at `public/resume.pdf`, or update its URL.
- [ ] Check the page at desktop, tablet and mobile widths.
- [ ] Test keyboard navigation, menu closing and section destinations.
- [ ] Test reduced motion and clipboard success/failure.
- [ ] Check screenshots for readable content and private information.
- [ ] Run the production build and review the built site.

---

<div align="center">

### Let’s build something extraordinary together.

Have a development role or a website project in mind?  
I’d like to hear about it.

[![Email](https://img.shields.io/badge/Email-Say_hello-ff744f?style=for-the-badge&logo=gmail&logoColor=17110d&labelColor=151713)](mailto:agharusman529@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-f2f0e9?style=for-the-badge&labelColor=151713)](https://linkedin.com/in/aghar-usmankt)
[![GitHub](https://img.shields.io/badge/GitHub-aghar--usman-f2f0e9?style=for-the-badge&logo=github&logoColor=f2f0e9&labelColor=151713)](https://github.com/aghar-usman)

<br />

<sub>Aghar Usman K T · Calicut, Kerala, India</sub>

[Back to top ↑](#developer-portfolio)

<img src="https://capsule-render.vercel.app/api?type=waving&amp;color=0:0c0d0c,60:151713,100:ff744f&amp;height=90&amp;section=footer" width="100%" alt="" />

</div>

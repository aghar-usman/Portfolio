---
name: AUKT Portfolio
description: Warm editorial portfolio with interactive demonstrations of full-stack work.
colors:
  canvas-light: "#FDF5E8"
  surface-light: "#F7E3C6"
  ink-light: "#1E111A"
  canvas-dark: "#141318"
  surface-dark: "#1D1C24"
  ink-dark: "#FDF5E8"
  brand-blue: "#2B5B84"
  accent-amber: "#F48C37"
typography:
  heading:
    fontFamily: "DM Serif Display, serif"
    fontWeight: 400
  body:
    fontFamily: "Space Grotesk, sans-serif"
---

## Overview
Preserve Aghar's original professional facts. The hero uses illustrated portraits and oversized AUKT lettering. Demonstrations explain actual work and clearly identify simulated data.

## Colors
Use the semantic CSS variables in app/portfolio-theme.css. Normal sections alternate the canvas with a secondary ground: #F6EBD9 in light mode and #1B1A20 in dark mode. Skills and Education use this alternate ground. Selected Work alone inverts its surface during the paper tear. Brand blue carries actions; amber highlights important details.

## Typography
DM Serif Display gives section headings an editorial voice. Space Grotesk carries copy, navigation, inputs, and buttons. Syne carries hero lettering. Reserve monospace for SQL and other code.

## Layout
Use the existing wrap for equal edges. Recompose columns into a single reading order on phones. The request playground keeps its input and action together, then shows the four processing stages and persistent results. Wrap code and labels without horizontal overflow.

## Components
Navigation, project actions, and contact links share the free Skiper40 directional underline and arrow interaction. Maintain the visible Skiper UI attribution. Keep the effect CSS-only, with keyboard focus parity, visible touch arrows, and no transition for reduced motion.

The Team Thai playground is a local, deterministic simulation. It starts on a deliberate Run action, explains each stage, and preserves the answer until the next action. Every sample and custom supported question uses fictional orders. Changing or deleting data is simulated as blocked. Keep the actual internship facts immediately below the interaction.

## Do's and Don'ts
Respect system reduced motion without a visible motion toggle. Retain focus indicators and text descriptions for statuses. Do not imply that the sample connects to Team Thai systems or a live language model. Preserve full-resolution portrait assets.

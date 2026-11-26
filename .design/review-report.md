# Portfolio hierarchy fixes

Implemented locally on 26 November 2026.

- Removed competing legacy root palette declarations. Browser confirmed light tokens #FDF5E8 and #1E4263; Contact now matches the hero.
- Reduced decorative hero wordmark emphasis while retaining full-resolution portrait assets.
- Increased meaningful metadata and helper text; preserved small optional credits.
- Kept the Team Thai frame and simplified redundant mobile dividers.
- Added Show full stack during drawing. Browser verified all 16 skills visible after activation; replay remains available.
- Kept navigation cells equal, with no-wrap labels; measured approximately 126.6px each in sampled desktop view.
- Improved dark-mode skill-icon contrast.

## Hierarchy blueprint
Primary: value proposition and one filled main action per section.
Secondary: supporting explanations, project preview and factual proof, grouped with spacing and restrained borders.
Tertiary: dates, location and captions, muted but readable.

## Verification
Browser screenshots inspected light/dark desktop Contact and mobile skills/experience. No horizontal page overflow at 390px or 320px in sampled states. TypeScript and four request simulation tests passed. Final lint result recorded separately in tool output. No actual blur simulation, physical device test or exhaustive browser matrix performed. Prior screenshot review identified oversized hero lettering as a competing focal point; emphasis has been reduced.

No commit or push. Approved copy, facts and major effects retained.


## Final release verification
Production webpack build passed; final TypeScript and targeted ESLint passed. Production preview tested at 320, 768, 1024 and 1440 CSS-pixel widths: no document horizontal overflow and no broken loaded images. Pending and blocked demo paths verified; coursework expansion, project details, email-copy feedback, mobile menu/Escape, and skills skip/replay checked. Production console returned no errors during the sampled run. Resume, SU·EN and AgriLeaf links returned HTTP 200. Blue tear cover and Remotion arrival pulse verified in the production preview. Physical devices and exhaustive browser coverage were not tested.

User authorized commit and push after this check.

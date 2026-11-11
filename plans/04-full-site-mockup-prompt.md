# 04 — Full Site Mockup Prompt (for Claude Design)

Give Claude Design this prompt once the asset sheet (prompt pack 03) looks right. This asks for the
complete page as an interactive mockup — Claude Design owns the visual design from here; the build
phase implements against whatever comes back, section by section, with your approval at each step.

---

```
Design the complete visual mockup for a personal 3D developer portfolio, as a single interactive
HTML page (or page set) showing every section in final visual form — not isolated assets this time,
the whole page, in order, as it will actually appear scrolling top to bottom.

DESIGN SYSTEM (locked, do not deviate):
- Colors: --ink-900 #000000, --ink-800 #0e0e10 (page background), --ink-700 #1c1c21 (raised
  surfaces/cards), --ink-600 #282732 (borders/dividers), --slate-400 #839cb5 (secondary text),
  --paper-50 #d9ecff (body text), --paper-00 #ffffff (headline text). ONE accent color:
  --signal-500 #ff6a3d (warm ember-orange), used only for: the 3D scene's rim-light/glow, the custom
  cursor, and exactly one highlighted word per section's headline. Nowhere else — this is a
  deliberately restrained one-accent palette, not a colorful site.
- Typography: "Mona Sans" (variable font) for all UI text, "JetBrains Mono" for stats/dates/tech
  labels (uppercase, wide letter-spacing). Headlines should feel heavy and slightly condensed.
- Visual signature for all 3D-feeling elements: gooch-style cool-to-warm gradient shading (not
  realistic PBR/photorealistic rendering), ember rim-light on every silhouette edge, subtle grain.
- Overall mood: dark, confident, spacious — generous negative space, not a cluttered dashboard. This
  is a senior/founder-level engineer's portfolio, not a bootcamp-project showcase.

SECTIONS, IN ORDER, WITH THEIR CONTENT:

1. HERO — Headline: "Hi, I'm Miracle Adebunmi, a full-stack engineer with a passion for building
   scalable and AI-driven applications." CTA button: "See my Works". This section is dominated by one
   continuous 3D environment (a personal, abstracted workstation scene — NOT a literal generic
   desk-plus-monitor-plus-plant composition; think considered sculptural forms, sparse, dark gallery
   feel, small orbiting geometric tech-icon forms) that the rest of the page scrolls "through" — show
   this as a sequence of 3-4 key establishing-shot frames at different scroll depths if the format
   doesn't support true continuous 3D, to communicate the intended camera journey. Scroll-down
   indicator at the bottom.

2. PROCESS STRIP — four-step sequence "Ideas → Concepts → Designs → Code", one simple icon per step
   (matching the SVG icon set), laid out as a slim horizontal strip.

3. SKILLS / ROLES — card grid, one card per role, each with its own small 3D tech-icon prop (geometric
   abstractions, not literal brand logos) floating above a short label: "Interactive Developer",
   "Backend Developer", "Python Developer", "React Developer", "Project Manager".

4. EXPERIENCE — vertical timeline. Entries (title — date range): "Freelance Python & Django Engineer
   — Oct 2019-Sep 2021", "Backend Engineer — Aug 2021-Dec 2022", "AI Software Engineer — Sep
   2022-Present", "AI Trainer — Sep 2024-Mar 2025", "Data Scientist — Feb 2025-Present", "Chief
   Software Architect & Founder — Dec 2024-Present". Note some overlap (concurrent freelance + full-
   time) — the timeline visual should accommodate that rather than assuming strictly sequential, non-
   overlapping entries.

5. PROJECTS — 3 project cards: "Patient Health App" (Comprehensive Health & Appointment Management),
   "RAG ChatBot" (Next-Gen AI Retrieval & Conversational Intelligence), "Chrona AI Production Timer"
   (Advanced AI-Driven Production Time Management by Blueprime). Each needs a title, one-line tagline,
   short description, and a cover-image placeholder area.

6. APPROACH / STATS — 5 value-prop cards: "Production-Ready Quality", "Cloud-Native Architecture",
   "Enterprise-Grade Compliance", "AI-Driven Innovation", "Punctual Delivery" (each with its one-line
   description — ask me for the exact text if needed, or use placeholder copy in this pass). Plus a
   stats row: "Completed Projects", "Client Retention Rate", "Satisfied Clients" (use placeholder
   numbers, exact figures TBD).

7. TESTIMONIALS — 5 testimonial cards with headshot placeholder + name: Akshay Saini, Amir Ali,
   Dhananjay Kumar Singh, Naven, Swati Srivastava. Quote text TBD — use short placeholder quotes for
   this pass.

8. CONTACT — Headline "Get In Touch". Copy: "Have a project in mind or want to discuss potential
   opportunities? Feel free to reach out through any of the channels below." A simple name/email/
   message form, plus GitHub and LinkedIn links/icons.

INTERACTION NOTES to express in the mockup where the format allows:
- A custom (non-circular) cursor trail in the accent color, visible anywhere the pointer moves over
  canvas/hero areas.
- Section transitions suggested as clip-path wipes or masked reveals rather than simple fades.
- The one accent-highlighted word per section headline should be visually called out distinctly (e.g.
  underline, color, or weight shift) — pick which word per section and show it.

OUTPUT: show the full page, section by section, with enough visual fidelity that layout, spacing,
color use, and typography hierarchy are all unambiguous — this will be hon directly implemented in
React/Three.js/GSAP afterward, so treat this as the authoritative visual spec, not a rough sketch.
```

---

**After this comes back:** bring it to me however you have it (paste the `.dc.html`, screenshot each
section, or just the live Claude Design link if there's a shareable preview). I'll check it against
this design-system spec and the content inventory in `00-overview.md`/`01-design-system.md`, flag
anything that drifted, and then we move into implementation — section by section, each one opened in
a real browser for your approval before the next, per the workflow you asked for originally.

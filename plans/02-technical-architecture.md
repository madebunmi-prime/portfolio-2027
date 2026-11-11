# 02 — Technical Architecture

## 1. Stack (locked)

| Layer | Choice | Why |
|---|---|---|
| Build tool | Vite 6+ | Confirmed current-gen; template genre is stuck on Vite 4. |
| Framework | React 19 | Current stable. |
| 3D | Three.js r17x+ (`WebGPURenderer` + TSL), `@react-three/fiber` v9, `@react-three/drei` latest | WebGPU/TSL confirmed production-viable 2026 (see `00-overview.md` § 2.3). WebGL2 fallback is automatic — R3F's `Canvas` auto-detects and falls back; no manual branching needed for the common case. |
| Animation | GSAP (`ScrollTrigger`, `Observer`) | Already proven on the live site; more capable than framer-motion for scroll-scrubbed work, which this design leans on heavily (camera path, kinetic type). |
| Styling | Tailwind CSS v4 | Current major version; CSS-first config (`@theme`) maps directly onto the design tokens in `01-design-system.md`. |
| Forms/contact | EmailJS | Already proven on the live site, no reason to replace a working, free integration. |
| Hosting | Cloudflare Pages | Matches current deployment; free, fast, already familiar. |
| Package manager | npm | No strong reason to switch; keep friction low for anyone cloning the repo. |

## 2. Repo structure

```
<repo>/
  src/
    scene/              # the one shared 3D world — camera rig, room, lighting, post-processing
      SceneRoot.jsx
      CameraPath.jsx     # ScrollTrigger-scrubbed CatmullRomCurve3 camera rig
      Room.jsx
      materials/
        signatureMaterial.js   # the one shared TSL material from 01-design-system.md
        cursorTrailMaterial.js
      postprocessing/
        PostFX.jsx         # bloom + chromatic aberration + DoF, cursor/scroll-velocity driven
      models/              # tech-icon glb wrappers, one component per icon
    sections/            # one component per page section, each a thin layer over `scene/` + copy
      Hero.jsx
      ProcessStrip.jsx
      Skills.jsx
      Experience.jsx
      Projects.jsx
      Approach.jsx
      Testimonials.jsx
      Contact.jsx
    content/              # ALL copy/data lives here as plain JS/JSON, never hardcoded in components
      hero.js
      experience.js
      projects.js
      testimonials.js
      stats.js
    hooks/
      useReducedMotion.js
      useScrollCamera.js
    lib/
      motion.js           # shared GSAP defaults (easing, durations) from 01-design-system.md § 3
    styles/
      tokens.css          # the :root custom properties from 01-design-system.md § 1-2
  public/
    models/                # .glb files — see § 3 budget below
    images/
    fonts/
  plans/                  # this planning doc set, kept in the repo as the build's own record
```

Content-in-`content/`, never hardcoded in JSX, is a direct fix for the one architecture anti-pattern
flagged in the template audit (`00-overview.md` § 2.2) — makes every section doc's "copy" section a
literal file to fill in, not prose to transcribe by hand later.

## 3. Performance budget (the template genre has none — this is the fix)

| Asset class | Budget | Enforcement |
|---|---|---|
| Total GLB payload (all models combined, Draco/Meshopt compressed) | ≤ 4 MB | checked in CI via a simple `du` script over `public/models/` |
| Largest single texture | ≤ 512 KB (KTX2/Basis compressed) | same |
| JS bundle (initial, gzipped) | ≤ 250 KB excl. Three.js core | `vite build` + `rollup-plugin-visualizer`, checked in CI |
| Lighthouse Performance (mobile, throttled) | ≥ 85 | CI gate, not just a nice-to-have |
| Time to first meaningful scene frame | ≤ 2.5s on mid-tier mobile | manual check on real device before each section is marked done |

Loading strategy: the room/camera scene loads behind a lightweight 2D hero (headline + CTA visible
immediately) and streams in once GPU/network conditions are confirmed adequate — never a blank screen
behind a full-page loader, which is the single worst first impression the template genre ships with.

## 4. Mobile / low-power degradation path (missing entirely in the template — explicit here)

- Detect `navigator.gpu` absence or a `prefers-reduced-motion` signal → render the static fallback
  camera shot (one authored hero frame, no live render loop) instead of the full interactive scene.
- On real mobile (regardless of GPU capability), cap pixel ratio at `1.5`, disable the bloom pass,
  and reduce camera-path scrub smoothing (cheaper interpolation, same path).
- Every tech-icon model gets a pre-baked low-poly LOD swapped in under a `useMediaQuery` check rather
  than relying on runtime LOD systems we'd have to build and debug ourselves.

## 5. Accessibility

- `prefers-reduced-motion` handled once, centrally (`01-design-system.md` § 3), not per component.
- All interactive 3D elements have a parallel, hidden, real DOM structure (semantic headings/links)
  so the entire content is screen-reader navigable independent of the canvas — the canvas is a visual
  enhancement layer, never the only way to reach the content.
- Color contrast checked against the actual token values in `01-design-system.md` (the `--slate-400`
  secondary text on `--ink-800` background needs a contrast check before use at body-text size — flag
  as a build-time checklist item, not assumed safe).
- Custom cursor (design-system § 5) never replaces focus-visible outlines for keyboard navigation.

## 6. 3D asset pipeline (how models actually get made — answers "what AI/UI prompts do we need")

Two asset classes, two different pipelines:

1. **Tech-icon models** (node/python/react/git/three.js equivalents for whatever the new skills section
   needs — mapped in `05-skills-roles.md`): these are small, iconic, geometrically simple. Generate via
   a text-to-3D tool (e.g. Meshy, Rodin, or Spline's AI model tool) with a prompt pattern like:
   > "A minimal, low-poly 3D icon of [subject], no texture, clean geometric facets, designed to be
   > re-shaded with a custom material — single mesh, under 5k triangles, centered at origin, true to
   > real-world proportions, no base/pedestal."
   Then run through `gltf-transform` (Draco + Meshopt compression) before import — this is a build
   step, documented in the README, not a one-off manual thing.
2. **The room/environment** (the hero's one big asset): too specific/personal to generate blind from a
   text prompt — needs either (a) a from-scratch Blender build using the prop list in
   `03-hero-scene.md`, or (b) an AI 3D generation pass per prop (same tool/prompt pattern as above,
   one prompt per distinct object) assembled into a scene in Blender, then exported once as a single
   optimized `.glb`. Recommend (b) — faster, and the signature material in `01-design-system.md` means
   individual prop fidelity matters less than overall composition, since the shared shader unifies
   everything visually regardless of source.

## 7. Build/CI

- Lint + typecheck + the performance budget checks above run in GitHub Actions on every PR.
- Lighthouse CI on preview deploys (Cloudflare Pages already generates preview URLs per PR for free).
- README documents the asset pipeline in § 6 explicitly — since this repo is meant to be cloned and
  studied, "how do I regenerate/replace the 3D assets" has to be answerable from the README alone.

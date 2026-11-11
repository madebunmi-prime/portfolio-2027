# 02 — Technical Architecture

## 1. Stack

> **Revised after the build.** Originally locked as Vite + npm (below, struck through for the record).
> The implementation that actually got built — via Claude Design's full-mockup pass — shipped on
> **Next.js 15 (App Router, static export) + pnpm** instead. Accepted as-is rather than forced back
> to Vite: the reasoning for Vite was "no SSR overhead you don't need for a mostly-static site," and
> Next's static export (`output: 'export'`, see `next.config.ts`) gets the same outcome — a fully
> static build with no server — while picking up Next's image/font tooling for free. Every other
> locked decision (React 19, R3F v9, Three r17x, GSAP, Tailwind v4) held exactly as planned.

| Layer | Choice | Why |
|---|---|---|
| Build tool | ~~Vite 6+~~ **Next.js 15 (static export)** | Static export matches the original "no SSR overhead" reasoning; Next's tooling (fonts, images, App Router) came along for free. |
| Framework | React 19 | Current stable — as planned. |
| 3D | Three.js r170, `@react-three/fiber` v9, `@react-three/drei` v10, `@react-three/postprocessing` | WebGPU/TSL path not yet wired into this pass — current build renders via the standard WebGL pipeline; see § 8 for the follow-up. |
| Animation | GSAP (`ScrollTrigger`) + Lenis (smooth scroll) | As planned, plus Lenis for scroll smoothing, which wasn't in the original spec but pairs naturally with scroll-scrubbed `ScrollTrigger` work. |
| Styling | Tailwind CSS v4 | As planned. |
| Forms/contact | Pluggable JSON POST endpoint (Formspree/Getform/Basin/custom), falls back to `mailto:` if unset | Deviates from the planned EmailJS integration — no vendor lock-in, no API key shipped in a public repo. Reasonable call for a repo meant to be cloned by others who'd each need their own EmailJS account otherwise. |
| Hosting | Cloudflare Pages | As planned — static export output (`out/`) deploys there directly. |
| Package manager | **pnpm** (not npm) | Deviates from "keep friction low with npm" — pnpm is now the more common default for new Next.js projects; `corepack enable` makes the friction difference negligible. |
| Validation | **Zod**, validating `content/portfolio.json` at build time | Not in the original plan — a typo in content now fails the build with a clear message instead of shipping a broken page. Directly reinforces the "content lives in data, never hardcoded" architecture principle from the template audit (`00-overview.md` § 2.2). |
| Testing | **Vitest** (unit) + **Playwright** (e2e smoke) | Not in the original plan — ships test coverage from day one rather than as a later addition. |

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

## 8. Known follow-ups (not yet done, tracked honestly rather than implied-complete)

- **WebGPU/TSL migration.** The shipped build renders through the standard `@react-three/fiber`
  WebGL pipeline, not `WebGPURenderer`/TSL as originally planned in § 1. The shader-signature proof in
  `design/asset-sheet/` validated the *look* using hand-written GLSL (not TSL) — the production
  renderer swap is still open work, not a silent scope cut.
  **Why this is still worth revisiting even though WebGL works fine today:** the shader signature
  (gooch shading, grain, rim-light) is currently one `ShaderMaterial` per mesh, each paying its own
  GPU driver overhead. A TSL node-material version compiles to WGSL on WebGPU and gets the 30-50%
  dense-scene gain cited in `00-overview.md` § 2.3 — more mesh instances (tech-icon props, testimonial
  cards, etc.) before frame time becomes a problem. Not urgent at the current scene complexity; becomes
  worth doing the moment the scene grows denser than what's in this first build.
- **Real project/testimonial images.** `public/images/` currently holds only a placeholder README —
  `content/portfolio.json` references paths that don't exist yet. Needs real assets before launch.
- **Content gaps from `00-overview.md` § 5** (real stats figures, testimonial quotes, responsibility-
  bullet-to-role mapping, client-logo approval) are still open — the shipped `content/portfolio.json`
  has placeholder copy in these spots, consistent with how the mockup prompt was written.

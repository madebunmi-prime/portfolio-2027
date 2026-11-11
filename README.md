# 3D Developer Portfolio

A cinematic, scroll-driven 3D portfolio template. A fully procedural night-lit room is the hero; the camera travels through it as you scroll, then the page slides over it.

**Stack:** Next.js (App Router, static export) · TypeScript · Tailwind CSS v4 · React Three Fiber + drei · @react-three/postprocessing · GSAP + ScrollTrigger · Lenis · Zod

---

## Quick start

```bash
corepack enable
pnpm install
pnpm dev          # http://localhost:3000
```

## Make it yours — edit one file

**All text, links, dates and numbers live in [`content/portfolio.json`](content/portfolio.json).** You never need to touch a component.

| What | Where in the JSON |
|---|---|
| Name, role, SEO | `person`, `site` |
| Hero headline, rotating phrase, CTAs, chapter labels | `hero` |
| What the 3D desk screens show as you scroll | `hero.screens` (issue, diagram, agent panes, CI, logs, welcome screen) |
| Proof numbers | `proof.items[]` |
| Problem-solving lifecycle | `lifecycle.stages[]` |
| Interactive C4 diagrams + ADRs | `systems.items[]` — node `x`/`y` are % of the canvas |
| Agent fleet graph + run log | `agents.nodes[]`, `agents.edges[]`, `agents.log[]` |
| Capability cards + 3D model | `capabilities.items[]` (`model`: `cube` · `hex` · `interlock` · `orbitals` · `branch` · `orb`) |
| Case studies | `work.items[]` |
| Jobs (overlaps handled automatically) | `experience.items[]` — dates are `YYYY-MM`, `end: null` = ongoing |
| Leadership principles | `leadership.items[]` |
| Tool marquee + hover cards | `toolbox.items[]` — `icon` is a [Simple Icons](https://simpleicons.org) slug, or `null` for initials |
| Testimonials marquee | `testimonials.items[]` |
| Contact form + socials | `contact`, `socials[]` |

**Conventions**

- Wrap one word in `[brackets]` to highlight it: `"title": "Selected [projects]."`
- `accent` is one of `violet` · `cyan` · `pink` · `amber` · `green` · `blue`.
- `icon` is one of `idea` · `concept` · `design` · `code` · `shield` · `cloud` · `lock` · `chip` · `clock` · `github` · `linkedin` · `x` · `mail` · `globe`.
- Images (`cover`, `logo`, `avatar`, `poster`, `ogImage`) are paths under `public/`, e.g. `"/images/projects/app.jpg"`. Use `null` for a styled placeholder.
- The JSON is validated with Zod at build time — a typo fails the build with a clear message instead of a broken page.

**Contact form** — set `contact.formEndpoint` to any form backend that accepts JSON `POST` (Formspree, Getform, Basin, your own Worker). Leave it `""` and the form falls back to opening the visitor's mail client with `contact.email`. No secrets live in this repo.

## Project structure

```
content/portfolio.json         ← the only file you edit
src/
  app/                         layout, page, Tailwind v4 theme + glow/glass utilities (globals.css)
  content/                     Zod schema + typed loader (cross-checks graph ids and categories)
  components/
    layout/                    Navbar, Footer
    sections/                  Hero, Proof, Lifecycle, Systems, Agents, Capabilities, CaseStudies,
                               Experience, Leadership, Toolbox, Testimonials, Contact
    ui/                        Button, Glow (rotating border card), HTrack (horizontal snap track),
                               Highlight, Icon, Media, SectionHeading, Monogram
    motion/                    Reveal (replaying clip-path wipes), CountUp, FlipWords, Marquee,
                               CursorTrail, SmoothScroll
    three/
      room/                    procedural room: Shell, Window, Desk, Workstation, Lamp, NeonSign, Shelf, Plant, Chair, Atmosphere
      screens/LiveScreens.ts   scroll-driven canvas content for the three desk screens
      props/TechModel.tsx      the 3D capability models
      HeroCanvas.tsx           hero scene + bloom
      CameraRig.tsx            scroll-driven camera path (flies into the monitor)
      ViewCanvas.tsx           ONE shared WebGL canvas for every small 3D tile (drei <View>)
      sky.ts                   canvas-drawn night sky
  lib/                         gsap setup, story chapters, C4 + graph helpers, timeline lanes, palette, hooks
tests/                         Vitest (content schema, story chapters, timeline math)
e2e/                           Playwright smoke test
```

## Scripts

| Command | |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Static export to `out/` |
| `pnpm start` | Serve `out/` locally |
| `pnpm lint` / `pnpm typecheck` | ESLint / tsc |
| `pnpm test` / `pnpm test:e2e` | Vitest / Playwright |

## Deploy

Any static host. **Cloudflare Pages:** build command `pnpm build`, output directory `out`.

## Accessibility & performance

- `prefers-reduced-motion` disables smooth scroll, reveals, marquees, rotating glow borders, screen typing, camera easing and the cursor trail.
- Text colours are tuned for ≥ 4.5:1 contrast on the glass card surfaces.
- The cursor trail only runs on fine pointers (no touch).
- 3D loads client-side after first paint; all small 3D tiles share a single WebGL context.

## License

[MIT](LICENSE) for the code. Replace the placeholder content with your own.

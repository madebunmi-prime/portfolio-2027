# 3D Developer Portfolio

A cinematic, scroll-driven 3D portfolio template. A fully procedural night-lit room is the hero; the camera travels through it as you scroll, then the page slides over it.

**Stack:** Next.js (App Router, static export) · TypeScript · Tailwind CSS v4 · React Three Fiber + drei · @react-three/postprocessing · GSAP + ScrollTrigger · Lenis · Zod

Planned before it was built — see [`plans/`](plans/) for the content inventory, design-system spec, and
architecture decisions this was implemented against, and [`design/`](design/) for the shader-signature
proof and mockup passes that preceded the code.

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
| Hero headline, buttons | `hero` |
| Roles + 3D model per card | `stack.roles[]` (`model`: `cube` · `hex` · `interlock` · `orbitals` · `branch`) |
| Jobs (overlaps are handled automatically) | `experience.items[]` — dates are `YYYY-MM`, `end: null` = ongoing |
| Projects | `projects.items[]` |
| Value props + stats | `approach.items[]`, `approach.stats[]` |
| Testimonials | `testimonials.items[]` |
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
  app/                         layout, page, Tailwind v4 theme (globals.css)
  content/                     Zod schema + typed loader
  components/
    layout/                    Navbar, Footer
    sections/                  Hero, Process, Stack, Experience, Projects, Approach, Testimonials, Contact
    ui/                        Button, Highlight, Icon, Media, SectionHeading, Monogram
    motion/                    Reveal (GSAP clip-path wipes), CountUp, CursorTrail, SmoothScroll
    three/
      room/                    procedural room: Shell, Window, Desk, Workstation, Lamp, NeonSign, Shelf, Plant, Chair, Atmosphere
      props/TechModel.tsx      the 3D icon models
      HeroCanvas.tsx           hero scene + bloom
      CameraRig.tsx            scroll-driven camera path
      ViewCanvas.tsx           ONE shared WebGL canvas for every small 3D tile (drei <View>)
      textures.ts              canvas-drawn screen / sky textures
  lib/                         gsap setup, timeline lane math, palette, hooks
tests/                         Vitest (timeline math, content schema)
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

- `prefers-reduced-motion` disables smooth scroll, reveals, camera easing, idle animation and the cursor trail.
- The cursor trail only runs on fine pointers (no touch).
- 3D loads client-side after first paint; all small 3D tiles share a single WebGL context.

## License

[MIT](LICENSE) for the code. Replace the placeholder content with your own.

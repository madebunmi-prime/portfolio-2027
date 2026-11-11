# Portfolio 2027

A personal 3D developer portfolio, planned and built in the open. This repo is the planning record
as much as the eventual code — every design decision is written down before it's built, and every
section is implemented against an approved spec rather than improvised.

## Status

Planning phase. See `plans/` for the full design — content inventory, design system, technical
architecture, and the asset-generation prompt pack used to validate the visual signature before any
production code was written.

## Structure

```
plans/            — the design docs, read in order (00 → 04)
design/            — design-system artifacts produced from the plans (e.g. the live shader-signature
                     proof in design/asset-sheet/)
```

## Stack (planned)

Vite + React 19 + React Three Fiber, pushed to WebGPU/TSL where it earns its keep, GSAP for scroll
choreography, Tailwind v4, deployed to Cloudflare Pages. Full rationale in `plans/02-technical-architecture.md`.

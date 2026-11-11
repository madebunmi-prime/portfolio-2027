# Contributing

1. Fork and create a branch: `feat/short-description` or `fix/short-description`.
2. `pnpm install`, then make your change.
3. Before opening a PR, run: `pnpm lint && pnpm typecheck && pnpm test`.
4. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`…).

## Ground rules

- **No hard-coded copy in components.** Every user-facing string belongs in `content/portfolio.json` and its Zod schema (`src/content/schema.ts`).
- **Styling is Tailwind.** Design tokens live in `src/app/globals.css` (`@theme`). Inline `style` only for values computed at runtime (accent colors, positions).
- **Motion lives in `src/components/motion` and `src/components/three/CameraRig.tsx`.** Sections compose `<Reveal>` / `<CountUp>` rather than calling GSAP directly.
- Respect `prefers-reduced-motion` in anything that animates.

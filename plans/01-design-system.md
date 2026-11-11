# 01 — Design System

Foundational doc. Every other section doc references this one instead of re-deriving tokens.

---

## 1. Color

Current site's tokens (`--color-black{,-50,-100,-200}`, `--color-blue-{50,100}`, `--color-white{,-50}`)
are a reasonable dark neutral base but have **no accent** — nothing to anchor CTAs, active states, or
the shader signature color. Keeping the neutral base (it's good — desaturated blue-grey reads as
"engineering," not "generic dark-mode purple"), adding one real accent pair.

```css
:root {
  /* neutrals — kept from current site, renamed for clarity */
  --ink-900: #000000;   /* true black, used sparingly for max-depth shadow only */
  --ink-800: #0e0e10;   /* page background */
  --ink-700: #1c1c21;   /* raised surface (cards, nav) */
  --ink-600: #282732;   /* border/divider on raised surfaces */
  --slate-400: #839cb5; /* secondary text, muted labels */
  --paper-50:  #d9ecff; /* body text on dark */
  --paper-00:  #ffffff; /* headline text, max-contrast */

  /* NEW — single accent pair, used for the shader signature + all interactive states */
  --signal-500: #ff6a3d; /* warm ember-orange — intentionally NOT blue/purple (avoids
                             "generic Three.js portfolio" blue-violet cliché; reads
                             as warm/human against the cool neutral base; doubles as
                             the rim-light color in the TSL material, tying 3D and UI
                             together) */
  --signal-300: #ffb199; /* lighter tint — hover states, bloom glow color */
  --signal-700: #c2451f; /* pressed/active state */
}
```

Rule: accent color appears in exactly three places — (1) the 3D scene's rim-light/bloom tint, (2) the
custom cursor + its trail, (3) one underline/highlight treatment per section on the single most
important word in that section's headline (see per-section docs for which word). Nowhere else. A
portfolio that uses its accent color everywhere has no accent color.

## 2. Typography

Keep **Mona Sans** (GitHub's variable font, self-hosted already in the current build — free,
well-made, already-proven to render well at the weights this design needs). Add one monospace for
code-flavored micro-copy (dates, stats, tech labels) to reinforce "engineer," not just "designer."

```css
--font-display: "Mona Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

Mona Sans is a variable font — use that properly instead of fixed weight steps:
- Headlines: `font-variation-settings: "wght" 680, "wdth" 92;` (slightly condensed, heavy — kinetic
  type sections animate this axis directly, e.g. width snapping 92→100 on scroll-in, which a static
  font can't do and is a cheap, distinctive motion signature unique to variable fonts)
- Body: `wght 420, wdth 100`
- Micro-labels/stats: `JetBrains Mono, 500, uppercase, 0.08em tracking`

Scale (fluid, `clamp()`-based, not fixed breakpoints):
```css
--text-hero:    clamp(2.75rem, 3.2vw + 2rem, 6.5rem);
--text-h2:      clamp(1.75rem, 1.6vw + 1.2rem, 3rem);
--text-body:    clamp(1rem, 0.3vw + 0.9rem, 1.125rem);
--text-micro:   0.8125rem;
```

## 3. Motion system

Two tiers, both must degrade cleanly under `prefers-reduced-motion: reduce` (template genre never
handles this — non-negotiable here per the engineering bar in `00-overview.md`):

- **Scroll choreography:** GSAP `ScrollTrigger` with `scrub: true` wherever motion is tied to scroll
  position (the camera path, kinetic type width axis, clip-path section wipes). Never a scroll-jacked
  fixed-duration animation that fights the user's actual scroll speed.
- **Micro-interaction:** GSAP timelines for discrete triggers (hover, click, form states), 180–280ms,
  `power3.out` easing as the one default — not a different easing curve per component.
- **Reduced-motion fallback:** every `ScrollTrigger` instance gets a paired static state applied via a
  single `prefers-reduced-motion` media query at the top of the motion module — sections appear in
  final position, camera path collapses to a single static establishing shot, cursor trail disabled.
  This is one shared utility (`useReducedMotion` hook + `applyStaticFallback()`), not per-section
  special-casing, so it can't be forgotten section by section.

## 4. The 3D material signature (ties directly to Direction A's differentiator #2)

One custom TSL node material, applied to every mesh in the scene (room geometry + all tech-icon
models), so the whole world reads as one deliberate illustration style rather than "GLTF export with
default PBR," which is the single most reliable tell of the template genre.

**Look:** gooch-style shading (cool-to-warm gradient ramp instead of realistic light falloff) + a
subtle animated grain/noise overlay (TSL `Fn()` noise node, time-driven) + rim light in `--signal-500`.
Visually: closer to a stylized illustration/concept-art render than a product-viewer render. This is
cheap to compute (no path tracing, no complex BRDF), fast on WebGPU, and — critically — the fact that
it's one shared material module means every object in the scene, including ones added later, inherits
the signature for free.

Reference implementation pattern (TSL, Three.js r17x+):
```js
// materials/signatureMaterial.js
import { Fn, vec3, mix, dot, normalize, cameraPosition, positionWorld, normalWorld, time, uniform } from 'three/tsl'

export const accentUniform = uniform(new THREE.Color(0xff6a3d))

export const signatureMaterial = Fn(() => {
  const viewDir = normalize(cameraPosition.sub(positionWorld))
  const ndotv = dot(normalWorld, viewDir).clamp(0, 1)
  const gooch = mix(vec3(0.11, 0.11, 0.13), vec3(0.85, 0.92, 1.0), ndotv) // cool shadow -> paper highlight
  const rim = ndotv.oneMinus().pow(2.5).mul(accentUniform)
  const grain = /* TSL noise fn, time-seeded, 0.02 amplitude */ 0
  return gooch.add(rim).add(grain)
})
```
(Exact TSL API surface to be verified against the installed Three.js version at build time —
flagged NEEDS VERIFICATION since TSL's node API has moved fast release to release; confirm against
whatever `three` version ends up pinned in `02-technical-architecture.md`.)

## 5. Cursor

Custom cursor replaces the OS cursor everywhere a canvas is in view (not globally — native cursor
stays on form inputs/text selection for accessibility). Built per the "Beyond the Circle" technique:
a custom-shaped (not circular) TSL-shaded trail, color `--signal-500`, length/opacity tied to cursor
velocity. Disabled entirely under `prefers-reduced-motion` and on touch devices (replaced with a
plain native cursor — no touch-equivalent gimmick, which is where most sites doing this get it wrong).

## 6. Grid & spacing

8px base unit. Section max-width `1400px`, side gutter `clamp(1.25rem, 4vw, 4rem)`. No section is
allowed a hard-coded pixel width anywhere — only the base unit, the fluid gutter, and `fr`/`clamp()`.

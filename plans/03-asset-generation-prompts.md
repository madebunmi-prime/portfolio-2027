# 03 — Asset Generation Prompts (for Claude Design / any AI design tool)

How to use this doc: each block below is self-contained — copy the whole prompt (including the
style-lock paragraph, which is repeated in every block on purpose so no asset drifts off-style if
generated in a different order or session) and paste it in as-is. Bring back whatever comes out;
I'll tell you if it holds to spec or needs a re-roll, and we fold the result into the asset pipeline
in `02-technical-architecture.md` § 6.

Every prompt shares one **style-lock paragraph** — this is what keeps 10+ separately-generated assets
reading as one coherent world instead of a mood-board of unrelated images:

> Visual style: stylized 3D concept-art render, NOT photorealistic PBR. Gooch-style cool-to-warm
> gradient shading (cool near-black/blue-grey shadow tones shifting to warm near-white highlight
> tones, no realistic light falloff). Single warm ember-orange rim light (#ff6a3d) outlining every
> silhouette edge. Subtle fine film-grain texture over the whole image. Background: near-black
> (#0e0e10) or deep blue-grey (#1c1c21), no gradients or vignettes beyond the rim light itself. Clean
> geometric forms, confident simple silhouettes — this is a developer's workspace environment, not a
> literal photograph: slightly abstracted, a little surreal, considered rather than cluttered.

---

## A. Mood board / style anchor (generate this FIRST, before anything else)

```
[STYLE-LOCK PARAGRAPH ABOVE]

Generate a single square mood-board composition: 4 small vignettes arranged in a grid, each showing
the same material/lighting treatment applied to a different simple object — (1) a sphere, (2) a cube,
(3) a torus knot, (4) a simple low-poly tree or plant. Purpose: confirm the gooch-shading + ember
rim-light + grain treatment reads consistently across completely different geometry before committing
it to the full room. No text, no logos. 1:1 aspect ratio.
```

Once this comes back looking right, every other prompt below inherits confidence that the style
actually holds up — don't skip this one even though it's the least "useful" output on its own.

---

## B. Hero room — overall environment concept (wide establishing shot)

```
[STYLE-LOCK PARAGRAPH ABOVE]

A personal developer's workspace, rendered as one continuous environment seen from a slightly elevated
three-quarter angle, wide establishing shot, 21:9 aspect ratio. This is the hero scene of a software
architect/founder's portfolio site — NOT a generic "desk with monitor and plant" scene (that exact
composition is overused in 3D developer portfolios and must be avoided). Instead:

- A central architectural desk/workstation form, but reinterpreted: imagine it built from simple
  extruded geometric forms rather than a literal furniture photograph — think "abstracted workstation
  sculpture" rather than IKEA desk.
- Scattered around it: a small cluster of simple floating/orbiting geometric icons representing
  technologies (a node-shape, a python-shape, a react-atom-shape, a git-branch-shape, a three.js-cube-
  shape) — simple, iconic, not literal brand logos, just forms that evoke them.
- One distinctly personal element that signals "Nigeria-first, globally-minded engineer and founder" —
  open to interpretation but avoid cliché (no generic flags/maps); think a subtle pattern, material
  choice, or small sculptural object that reads as a considered personal detail rather than a token
  gesture.
- Negative space matters — this should feel like a considered, sparse installation in a dark gallery,
  not a cluttered desk. Lots of near-black background, the rim-lit objects doing all the work.

This is reference/concept art to guide a Blender build and/or a per-prop AI-3D-generation pass — not
the final 3D asset itself, so prioritize a clear, readable silhouette and composition over fine detail.
```

---

## C. Individual room props (generate each separately once B is approved, for the "per-prop AI-3D-gen"
pipeline option in `02-technical-architecture.md` § 6b)

For each prop below, use this wrapper and swap in the `[PROP]` line:

```
[STYLE-LOCK PARAGRAPH ABOVE]

Single hero object on an otherwise empty near-black background, centered, 1:1 aspect ratio, as a
turntable-style reference (object fully visible, no cropping) suitable for use as a 3D modeling
reference sheet.

[PROP]
```

- `[PROP]` = "The central workstation form described in prompt B — just this one object, isolated."
- `[PROP]` = "A simple abstracted node.js icon as a physical sculptural object — a hexagonal prism
  form with subtle internal faceting, no text/logo, just the geometric essence of the hexagon mark."
- `[PROP]` = "A simple abstracted Python icon as a physical sculptural object — two interlocking
  curved forms suggesting the two-snake mark, simplified to clean geometric curves, no text/logo."
- `[PROP]` = "A simple abstracted React icon as a physical sculptural object — three intersecting
  elliptical rings around a central sphere, simplified and geometric, no text/logo."
- `[PROP]` = "A simple abstracted git icon as a physical sculptural object — a branching node-and-line
  form, three small spheres connected by curved tubes, no text/logo."
- `[PROP]` = "A simple abstracted Three.js icon as a physical sculptural object — a cube with one
  corner unfolded/exploded to reveal internal geometric structure, no text/logo."
- `[PROP]` = "The personal/Nigeria-first element described in prompt B — just this one object,
  isolated, fully resolved."

---

## D. Custom cursor trail shape (feeds the TSL cursor-trail material in `01-design-system.md` § 5)

```
[STYLE-LOCK PARAGRAPH ABOVE]

Design 4 alternative silhouette shapes (shown side by side) for a custom cursor trail — NOT a circle
or teardrop blob (that's the generic default this must specifically avoid). Each shape should be a
single simple, elongated, motion-suggestive silhouette capable of being stretched/scaled along a
velocity vector without looking broken — think a stylized comet, a chevron/arrow sliver, an asymmetric
leaf-like sliver, a lightning-bolt-like zigzag sliver. Flat shapes, ember-orange (#ff6a3d) fill, no
gradient, no shading, on transparent/black background — these are for direct use as an alpha mask in
a shader, not concept art, so keep them flat and graphic rather than rendered in the 3D style above.
```

---

## E. Project cover art refresh (optional — only if you want visual consistency across the whole
site; current images are real product screenshots and may be worth keeping as-is for credibility)

```
[STYLE-LOCK PARAGRAPH ABOVE]

A stylized abstract cover illustration (NOT a literal UI screenshot) representing [PROJECT], for use
as a project-card background in a portfolio. 16:9 aspect ratio. Suggest the project's domain through
abstracted iconography and the gooch-shaded geometric style above, rather than depicting any literal
interface.

[PROJECT] = "a healthcare patient-management application — suggest care, continuity, and real-time
tracking through gentle overlapping circular/pulse forms, nothing clinical or cold"
[PROJECT] = "a RAG AI chatbot — suggest retrieval and conversation through a network of connected
nodes feeding into a single central conversational form"
[PROJECT] = "an AI-driven production timer for creative workflows — suggest time, precision, and
creative flow through a stylized clock/timeline form intertwined with a soft flowing ribbon"
```

Flagging honestly: real product screenshots usually read as *more* credible than abstract art for an
actual case-study/project section — recommend keeping the real screenshots for the project detail
view and using these only for the card-grid thumbnail/hover state, if at all. Your call once you see
both side by side.

---

## F. Brand mark / favicon

```
[STYLE-LOCK PARAGRAPH ABOVE]

A minimal monogram mark using the initials "MA" (Miracle Adebunmi), designed to work as a 32x32px
favicon as well as a larger brand mark — so: extremely simple, 2-3 geometric strokes maximum, must
remain legible at tiny size. Flat ember-orange (#ff6a3d) on transparent background, no gradient, no
3D rendering for this one specifically — it needs to work as a flat vector mark, not a rendered scene.
Show 3 distinct alternative compositions side by side.
```

---

## What's deliberately NOT in this list

Anything requiring exact code behavior (the camera path, the shader material itself, the GSAP
ScrollTrigger wiring, the actual `.glb` export/compression pipeline) isn't something an image-generation
tool produces — those stay in the technical build phase per `02-technical-architecture.md`. This doc
only covers what's genuinely a visual-design problem a design tool can originate.

When you bring results back: tell me which prompt they're from (the letter, e.g. "B" or "C — node"),
and I'll check them against the style-lock and the technical constraints (triangle count guidance for
the room props, aspect ratios, etc.) before we fold anything into the build.

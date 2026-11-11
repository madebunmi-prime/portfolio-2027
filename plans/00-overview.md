# Portfolio 2027 — Master Plan

Status: **Direction A locked (§ 4). Writing full section-by-section docs now.**

---

## 1. What this replaces

Current live site: https://portfolio-cbb.pages.dev/ — Vite + React SPA, React Three Fiber + Three.js,
GSAP (ScrollTrigger/ScrollSmoother/Observer), EmailJS contact form. Source was never committed to a
repo — it only exists as this deployed build, reverse-engineered below.

**Your own framing, which this plan takes as the core brief:** the current site runs the same pattern
as the JavaScript Mastery / `adrianhajdin/project_3D_developer_portfolio` tutorial template — a genre
with 10+ near-identical public GitHub forks. It is "2 years behind." The new one must be good enough
that *other developers want to clone it*, published publicly, properly engineered.

---

## 2. Research synthesis (verified directly, not assumed)

### 2.1 Full content inventory recovered from the live build

**Identity / Hero:**
> "Hi, I'm Miracle Adebunmi, a full-stack engineer with a passion for building scalable and
> AI-driven applications." — CTA: "See my Works"

**Nav / process icons:** Code, Concepts, Designs, Ideas (`/images/{code,concepts,designs,ideas}.svg`)
— reads like a 4-step "Ideas → Concepts → Designs → Code" process strip.

**"My Preferred Tech Stack" (typo "Preffered" in current site — fix in rebuild) — role/skill cards,
each paired with a 3D model:**
| Role framing | Model |
|---|---|
| Interactive Developer | `three.js-transformed.glb` |
| Backend Developer | `node-transformed.glb` |
| Python Developer | `python-transformed.glb` |
| React Developer | `react_logo-transformed.glb` |
| Project Manager | `git-svg-transformed.glb` |

**"Professional Work Experience" — timeline (overlapping roles, freelance + full-time concurrently):**
| Title | Dates |
|---|---|
| Freelance Python & Django Engineer | Oct 2019 – Sep 2021 |
| Backend Engineer | Aug 2021 – Dec 2022 |
| AI Software Engineer | Sep 2022 – Present |
| AI Trainer | Sep 2024 – Mar 2025 |
| Data Scientist | Feb 2025 – Present |
| Chief Software Architect & Founder | Dec 2024 – Present |

Responsibility bullets recovered (exact wording, need to confirm which role each belongs to with you):
- "Defined and enforced OpenAPI/Swagger contracts and versioning strategy to guarantee backward
  compatibility for mobile and frontend clients."
- "Generated gold-standard training datasets that significantly improved model consistency and
  reliability."
- "Integrated payment gateways (Stripe, PayPal) and messaging services (Twilio, SendGrid) to support
  seamless user workflows."
- "Provided detailed documentation and conducted training sessions, enabling client teams to operate
  and extend the solutions autonomously."

**Projects:**
| Project | Tagline | Image |
|---|---|---|
| Patient Health App | "Comprehensive Health & Appointment Management" — online app for managing patient records, scheduling physical & telehealth appointments, tracking treatment progress in real time | `patient_health_app_compressed.jpg` |
| RAG ChatBot | "Next-Gen AI Retrieval & Conversational Intelligence" — cutting-edge RAG system using vector search and dynamic context for concise, context-rich AI conversations | `rag_ai_chatbot_landscape_compressed.jpg` |
| Chrona AI Production Timer | "Advanced AI-Driven Production Time Management by Blueprime" | `chrona_poster_compressed.jpg` |

**Approach / value-prop cards:**
- Production-Ready Quality — "Delivering bullet-proof code with robust testing and CI/CD pipelines."
- Cloud-Native Architecture — "Building resilient, auto-scaling systems on modern cloud platforms."
- Enterprise-Grade Compliance — "Ensuring strict adherence to security standards and industry regulations."
- AI-Driven Innovation — "Embedding advanced AI models to power smarter, adaptive solutions."
- Punctual Delivery — "Hitting every milestone and deadline with unwavering reliability."

**Stats labels (numbers not yet recovered — need current real figures from you):** Completed Projects,
Client Retention Rate, Satisfied Clients.

**Client/employer logos present:** BluePrime, Chase, Fiverr, Secomind, Turing, plus 2 unlabeled
data-annotation client images — need to confirm these are current/approved to show.

**Testimonials (5, matching 5 timestamp-named headshot photos):** Akshay Saini, Amir Ali, Dhananjay
Kumar Singh, Naven, Swati Srivastava. **Quote text not yet recovered** — truncated in the minified
bundle before the `mentions:"` key; need these pulled via live DOM read or from you directly.

**Contact:** "Get In Touch" — "Have a project in mind or want to discuss potential opportunities? Feel
free to reach out through any of the channels below." Form (name/email/message via EmailJS) +
GitHub (`github.com/miracle5284`) + LinkedIn (`linkedin.com/in/blueprime1`).

**Full asset manifest recovered from the live bundle:**
- 3D models: `computer-optimized-transformed.glb`, `git-svg-transformed.glb`, `node-transformed.glb`,
  `optimized-room.glb` **(a full 3D room scene — this is the hero centerpiece, not just floating
  icons)**, `python-transformed.glb`, `react_logo-transformed.glb`, `three.js-transformed.glb`
- Texture: `mat1.png`
- UI icons: arrow-down, arrow-right, code, concepts, designs, ideas (all SVG), star.png
- `bg.png` (background)

**Design tokens (from live CSS, confirmed real values):**
```
--color-black:     #000
--color-black-50:  #1c1c21
--color-black-100: #0e0e10
--color-black-200: #282732
--color-blue-50:   #839cb5
--color-blue-100:  #2d2d38
--color-white:     #fff
--color-white-50:  #d9ecff
font-family: "Mona Sans", sans-serif   (GitHub's variable font — self-hosted, not a CDN)
```
Reasonable starting palette (dark, desaturated blue-greys), but under-developed: no accent color
beyond near-black/blue-grey, no warm or high-chroma note anywhere. Flagged for the design-system doc.

### 2.2 Template architecture audit (`adrianhajdin/project_3D_developer_portfolio`, cloned and read directly)

**Stack is dated two major versions across the board:** React 18.2 (current: 19.x), Three.js r149
(current: r17x+, WebGPU/TSL-capable), @react-three/fiber v8 (current: v9), framer-motion v9, Vite 4.
The live site upgraded some of this (real GLB models instead of decal-on-icosahedron, GSAP instead of
framer-motion) but is the same generation and genre.

**Patterns worth keeping:** per-section isolated `<Canvas frameloop="demand">` (only renders on
interaction/change — real perf win), `Suspense` + `drei`'s `<Preload all>`, decal-texture-on-primitive
technique for cheap icon rendering where a full GLB is overkill.

**Patterns to deliberately avoid:** inline hardcoded hex colors in JSX class strings instead of design
tokens, no code-splitting of the heavy GLB payloads, no `prefers-reduced-motion` handling anywhere, no
mobile-specific 3D degradation path (it just renders the full scene and hopes).

### 2.3 2026/2027 state of the art (cited, verified directly — not the template genre)

1. **WebGPU + TSL is genuinely production-ready now, not bleeding-edge.** Three.js r171 made
   `WebGPURenderer` zero-config; Safari shipped WebGPU support in v26 (Sept 2025), so Chrome, Firefox,
   and Safari all support it — ~95% global coverage, with automatic WebGL2 fallback for the rest.
   Renderer swap is close to a one-line change. Real gains: 30-50% on dense scenes, lower CPU overhead,
   and GPU compute shaders that push particle counts from a ~50k CPU-bound ceiling into the millions.
   *(Sources: [utsubo.com WebGPU migration guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide), [What's New in Three.js 2026](https://www.utsubo.com/blog/threejs-2026-what-changed))*
2. **The "floating desk / tech-icon orbit" genre is dated.** Current Codrops (2026) coverage of serious
   creative-dev portfolios is working in a different register entirely:
   - *"Beyond the Circle: Building a Custom-Shaped Cursor Trail with Three.js and TSL"* (Sept 2026) —
     replaces generic circular cursor blobs with fully custom brush-shaped trails, built on WebGPU/TSL.
   - *"From Shader Uniforms to Clip-Path Wipes: How GSAP Drives My Portfolio"* (May 2026) — flowmap
     text distortion that reacts to the cursor, velocity-driven chromatic aberration, GSAP-driven
     clip-path section wipes instead of generic fade/slide transitions.
   - *"Creating an Interactive 3D Cluster with Three.js, TSL and Three Start"* — an icosahedron turned
     into a dynamic, noise-driven, interactive cluster with post-processing — i.e. 3D as a *reactive
     material/field*, not a parked model you orbit with `OrbitControls`.
   - *"Inside Au-rel.io: A Portfolio Built Around Grid and Motion"* — a real, recent portfolio case
     study built on masked reveals, cursor-led page transitions, and an interactive self-portrait —
     notably **mostly 2D grid/typography with surgical 3D/shader accents**, not a full 3D scene.
   *(Source: [tympanus.net/codrops](https://tympanus.net/codrops/category/tutorials/) tag pages for `webgpu` and `cursor`)*
3. **Bar for "properly engineered, publicly cloneable":** `prefers-reduced-motion` fallback for all
   WebGL/shader content, graceful WebGPU→WebGL2 degradation (not a hard requirement — React 19/Vite
   already there), mobile GPU/battery-aware scene complexity, and genuine Core Web Vitals discipline
   (the current template genre routinely ships multi-MB GLBs with no budget — we will set one).

---

## 3. Decisions already locked with you

- **Stack:** Vite + React 19 + React Three Fiber, pushed to WebGPU/TSL where it earns its keep.
- **Repo:** brand-new, new name, under the **`madebunmi-prime`** GitHub identity (your public/OSS
  identity, separate from `miracle5284` and any BluePrime account) — appropriate since this is meant
  to be publicly studied and cloned.
- **Process:** this plan doc, then one detailed MD per section (content/copy, animation spec, 3D/graphics
  spec incl. AI-generation prompts, font, wireframe, interaction behavior down to word-level detail),
  each approved by you before the next is written. Then build section-by-section, each one shown to
  you in a real browser for approval before moving to the next.

---

## 4. The one decision I need from you before writing full section docs

Two genuinely different, both-defensible directions came out of the research. Writing 10+ fully
detailed section docs (wireframes, shader specs, copy) is wasted work if we pick the wrong one first —
so this is the actual plan/critique gate, not busywork.

**Direction A — "Evolved Immersive Scene."** Keep the spirit of the current site (one continuous 3D
room/world you scroll and orbit through) but rebuild it properly: WebGPU/TSL renderer, custom shader
work instead of stock materials, the room itself reactive to scroll/cursor rather than static, real
mobile degradation path. Pro: biggest visual "wow," plays to the fact you already have working 3D
asset instincts (the room + icon models). Con: hardest to make NOT read as "a much nicer version of
the same genre" — the silhouette (big 3D scene, scroll through sections inside it) is still the
thing that's now common.

**Direction B — "Grid + Motion, Surgical 3D" (the Au-rel.io pattern).** Primarily a strong 2D
grid/typography-driven layout — kinetic type, GSAP clip-path section transitions, a custom cursor
with a TSL-shaded trail — with 3D used as *accents*, not the whole stage: e.g. one shader-driven
hero field, one interactive 3D cluster for the skills section, rather than a full orbitable scene
throughout. Pro: this is what's actually distinguishing sites in 2026 per the research above, far
less likely to read as templated, usually faster/lighter on mobile. Con: less of a single dramatic
"look what I built in 3D" moment; the 3D work is more subtle and technically dense per-pixel rather
than broad.

**My recommendation: Direction B**, specifically because your own stated bar is "worthy of emulation,
nobody can tell what we did" — Direction A's silhouette is still legible as "a 3D portfolio scene,"
just a better one. Direction B's techniques (TSL cursor trails, shader-driven text/section transitions,
one or two dense interactive 3D moments rather than a whole navigable scene) are what's actually
reading as current in the sources above, and they're more original specifically *because* fewer
people have shipped them yet.

Tell me A, B, or a hybrid you have in mind, and I'll write the full section-by-section MDs
(hero, process strip, skills, experience, projects, approach/stats, testimonials, contact, design
system, technical architecture) against that direction.

### 4.1 Decision: Direction A — with specific guardrails against the risk I flagged

You picked A. The risk noted above stands (silhouette still reads as "a 3D scene site"), so A is
**not** "rebuild the same room with a better renderer." Four concrete differentiators, each pulled
from the cited 2026 research rather than invented, make it a genuinely different thing wearing the
same genre's clothes:

1. **Cinematic scroll-locked camera path, not free `OrbitControls`.** The current template (and its
   10+ forks) all let you drag-orbit a parked model. Instead: one continuous camera rig moving along
   an authored spline through the scene, driven by scroll position (GSAP `ScrollTrigger` scrubbing a
   Three.js `CatmullRomCurve3` path — a curve type already present in the live bundle, so this is a
   natural extension, not a bolt-on). The visitor never manually orbits; the *scene* choreographs the
   reveal. This alone changes the interaction model from "inspect an object" to "travel through a
   space," which is the actual distinguishing move in the Au-rel.io-style sites, just applied inside
   a full 3D environment instead of a 2D grid.
2. **Custom TSL shader materials, not stock `MeshStandardMaterial`/PBR.** Every forked clone uses
   default Three.js materials on the GLB models, which is why they all look alike regardless of the
   actual geometry. A custom node-based TSL material (gradient gooch/toon shading, or a stylized
   rim-light + noise-grain look) applied consistently across the room and every tech-icon model gives
   the whole scene one deliberate, unmistakable visual signature — this is exactly what the "Interactive
   3D Cluster with TSL" Codrops piece does to an otherwise-plain icosahedron.
3. **Cursor-reactive post-processing tied to the room, not a separate DOM cursor.** Bloom intensity,
   chromatic aberration, and a subtle depth-of-field pull react to cursor velocity and scroll speed —
   the "Beyond the Circle" cursor-trail technique, adapted so it's reacting to and revealing the 3D
   environment itself rather than drawing a 2D trail on top of it.
4. **A personal, specific environment, not a generic "desk."** The room's geometry and props should
   read as *yours* — nod to BluePrime, your actual toolchain, something Nigeria-first/personal per
   your own brand rather than the generic beige-desk-plus-monitor silhouette every fork reuses verbatim.
   Concrete prop/scene direction gets specified in `03-hero-scene.md`.

Net: same category (one navigable 3D environment), but the actual mechanics — camera, material,
post-processing, scene content — share almost nothing with the template genre once built. This is
what the section docs below are written against.

---

## 5. Open content gaps (need from you, not guessable)

- Real current figures for Completed Projects / Client Retention Rate / Satisfied Clients.
- The 5 testimonial quotes (bundle truncated before the actual quote text).
- Which responsibility bullets belong to which job title (recovered flat, not yet mapped).
- Whether the Chase/Fiverr/Secomind/Turing/BluePrime client logos are current and approved to display.
- Any new projects since this build that should replace/join Patient Health App, RAG ChatBot, Chrona.

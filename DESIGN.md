# Design

The visual system for the PETs Transformer web app and its evidence dashboard. Strategy and audience live in
[PRODUCT.md](PRODUCT.md). Tokens are defined once in `web/frontend/src/theme/` and mirrored as CSS variables in
`engine/src/pets_engine/report/templates/dashboard.html`. The studio's look, 3D model and motion follow the Veilgate
studio (github.com/Abdul1452/veilgate-source), adapted to this engine's own steps and results.

## Principles

1. **Colour carries meaning, never decoration.** Mandarin `#FD550A` means *needs your attention*: data that identifies a
   person alone, records that stand out, the current step, the one action that matters now. Forest `#015D47` means
   *handled*: protected data, done steps, the primary action.
2. **Every screen answers four questions in five seconds:** what is this (a numbered title and a one-line lead), what do
   I do (one primary button), what is the system doing (the busy pill and the 3D model) and what came out (the model,
   its two figures, the verdict).
3. **Depth is physical.** Buttons and choice cards sit on a visible bottom edge and press down when clicked; a chosen
   scenario stays pressed, so state shows without colour.
4. **Motion follows logic.** The 3D model changes only when the data's state changes; pages swing in from the direction
   of travel; numbers count between real values. Nothing animates on scroll.
5. **Show proof, not claims.** The landing page quotes the README's self-assessed results and its risks that remain.

## Pages and routes

| Path | Page |
|---|---|
| `/` | Landing: hero with a live 3D demo, results against the challenge baseline, how it works, results per recipient, risks that remain |
| `/release/data` | Step 1, data. `?sample=health` registers that sample straight away (the landing page's main button) |
| `/release/recipient` | Step 2, recipient |
| `/release/columns` | Step 3, Detect's columns |
| `/release/run` | Step 4, last look and run |
| `/runs` | Every run on this machine |
| `/runs/:runId` | One run: verdict, scores, downloads, evidence dashboard, timeline |

A step page opens only once the steps before it are answered; otherwise it redirects to the first open one. The draft
(choices and column names, never data values) lives in the studio layout, so moving between step pages keeps it, and in
session storage, so a refresh keeps it too. It is cleared when a run starts.

## The studio shell

A 300px rail, dark in both themes, beside the page: the brand, the 3D model of the data with a caption and legend, two
live figures, the steps (done = forest tick, current = mandarin, not yet open = lock) and the run history. Below `lg`
the rail gives way to a top bar and the horizontal stepper. The top bar carries the dataset and recipient, a busy pill,
Start over, Data handling (a drawer), New release and the theme button. A boot screen (a scanning lattice cube) stays
up until the API answers once per page load, and says how to start the backend if it can't connect.

## The 3D model

`shared/components/core-model/` draws 216 points on a canvas, without WebGL. Each point stands for an equal share of the
records. `features/release/utils/studio-view.ts` maps real state to the model:

| State | Model |
|---|---|
| No data | Idle sphere |
| Data chosen | A lattice of records |
| Detect has read the columns | The lattice layered by role, in each role's colour; a person's decision moves the layers |
| Gate running | Faster spin and an orange scan plane |
| Released | Records drawn into look-alike groups, sealed in a locked cage |
| Held for review | Groups with the cage drawn but not locked |
| Blocked | Records left standing out; the share is 1 − the privacy score, and the legend says so |
| Public answers only | Records dissolve into a cloud: no rows leave |

It rotates with a drag or the arrow keys, its `aria-label` says what it shows, and it stands still under reduced motion.

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#F2EFE7` | `#0A1713` | Page |
| `bg.panel` / `bg.raised` | `#FBFAF6` / `#FFFFFF` | `#0F201B` / `#132822` | Panels / inputs, cards and keys |
| `border` / `border.emphasized` | `#E2DCCF` / `#CCC4B3` | `#22403A` / `#33564D` | Dividers / control edges |
| `fg` / `fg.muted` | `#10241E` / `#525F5A` | `#E6F0EC` / `#A9BEB6` | Text / secondary text |
| `brand.*` (forest) | solid `#015D47` | solid `#8FD3B6` | Primary buttons, done steps, released |
| `accent.*` (mandarin) | solid `#FD550A`, text `#B03A00` | solid `#FD550A`, text `#FF9A66` | Current step, Run the gate, focus ring, identifying data |
| `deep.*` | fixed `#05231C` | fixed `#05231C` | Rail, landing hero, 3D stage |

Every text token clears WCAG 2.2 AA (4.5:1) on its surfaces in both modes; text on mandarin is always dark.

**Tags.** Each vocabulary has its own palette, always with an icon and a word, so colour is never the only cue:

- Detect's roles (`role-words.ts`): identifies alone mandarin, technical ID yellow, clue blue, private fact pink,
  free text purple, row ID grey, harmless forest. The same colours layer the 3D model.
- Trust levels (`trust-words.ts`): internal forest, controlled research blue, partner under contract purple, public mandarin.
- Dataset subjects (`dataset-icons.ts`): healthcare pink, customer service purple, cybersecurity blue, and so on.
- Run stages (`stage-words.ts`): detect blue, select purple, tune yellow, transform cyan, verify forest, answers teal.
- Run status (`status-words.ts`): released forest, held orange, blocked and failed red, running blue.

## Typography

One family: IBM Plex Sans for everything, IBM Plex Mono for identifiers and figures (column keys, scenario and run IDs,
scores, step indexes). Both are bundled, so no font request leaves the machine.

- Page title: `4xl` (`3xl` on phones), bold, letter-spacing `-0.022em`, with the step index in mono mandarin before it.
- Section heading: `lg` or `md`, semibold. Body: `md` for leads, `sm` for most UI text, `xs` for hints. Prose capped at 70ch.
- Figures use tabular mono, so digits don't jump while they count.

## Shape and spacing

Radii: 6px (`l1`), 10px (`l2`), 18px (`l3`, panels and cards), 12px for controls; pills for tags. Keys carry a 2–3px
bottom edge (`shadows.key`). Spacing follows Chakra's 4px scale, with more air between sections than within them.

## Motion

| What | How |
|---|---|
| Page change | Swings in from the side you travel towards (perspective, 550ms) |
| Content | Children rise 8px into place in a short stagger |
| Numbers | Count from the previous value to the new one (700ms ease-out) |
| Meters | Fill once |
| Verdict | The status mark pops in; a release gets the "Sealed" stamp |
| Working | A flipping 3D cube beside the word "Working" |

`prefers-reduced-motion` turns all of it off, including the model's spin and the landing demo's auto-advance.

## States

Boot (scanning cube until the API answers, retry on failure), loading (skeletons and a sentence saying what is
happening), empty (an icon and what will appear), error (inline alert), offline (an amber banner while the browser is
offline), success (the verdict banner and seal), blocked step (Continue disabled, with the reason beside it).

## Iconography

Lucide only, at 12–20px, `aria-hidden` when a word sits beside it. Icons label steps, subjects, roles, trust levels,
stages, statuses and actions.

## Accessibility

WCAG 2.2 AA. A skip link on the landing page, a 2px mandarin focus ring on every focusable element, real buttons with
radio and tab semantics for card choices and the demo tabs (arrow keys move between tabs), `aria-current="step"` in the
rail, `aria-live` on the model's caption and the run timeline, counting numbers that expose only their final value to
screen readers, labels on every icon-only control, and layouts that reflow from 390px phones to ultra-wide screens
without horizontal scroll.

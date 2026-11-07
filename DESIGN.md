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
| `/` | Landing: hero with a live release-gate demo, usefulness against the challenge baseline, how it works, results per recipient, risks that remain |
| `/release/data` | Step 1, data. `?sample=health` registers that sample straight away (the landing page's main button) |
| `/release/recipient` | Step 2, recipient |
| `/release/columns` | Step 3, Detect's columns |
| `/release/run` | Step 4, last look and run |
| `/runs` | Every run on this machine |
| `/runs/:runId` | One run, which is its dashboard: who it's for, the verdict and headline numbers, then the evidence in tabs (`?tab=`) |

A step page opens only once the steps before it are answered; otherwise it redirects to the first open one. The draft
(choices and column names, never data values) lives in the studio layout, so moving between step pages keeps it, and in
session storage, so a refresh keeps it too. It is cleared when a run starts.

## The studio shell

A 300px rail, dark in both themes, beside the page: the brand, the 3D model of the data with a caption and legend, two
live figures, links to every run and a new release, and the latest runs (the one on screen marked, each with its status
icon). On a run, a switch above the model shows the data **Original** (every source column, layered by role, identifiers
in mandarin) or **Protected** (what the gate made of it, drawn in the scenario's look-alike group size); the model
morphs between them and the caption, legend and figures follow. Below `lg`
the rail gives way to a top bar and the horizontal stepper. The top bar carries the dataset and recipient, a busy pill,
Start over, Data handling (a drawer), New release and the theme button. A boot screen (a scanning lattice cube) stays
up until the API answers once per page load, and says how to start the backend if it can't connect.

## The wizard panel

The new-release wizard has no rail and no model: a 300px light panel (`bg.subtle`) beside the step, hidden below `lg`.
It reads top to bottom as the release being built. Each step shows its answer under its name once it has one (the
dataset and table count, the recipient, how many column decisions are the person's own), so there is no separate
summary. The current step sits in a raised card with a mandarin marker; done steps are forest ticks and can be clicked
to go back; steps not yet open say which step opens them. The foot is pinned: Start over, and the reminder that the
data never leaves this machine.

## The run page

A run's page is its dashboard; nothing is embedded. Top to bottom:

1. **Header.** Scenario id and trust level as tags, the recipient as the title, the purpose as the lead, the downloads
   (protected data as the main action, the evidence package beside it), and one line of facts: run id, when it was
   decided, how long it took, the look-alike bar, the engine.
2. **Verdict.** The verdict banner, the attempt it came on and the combined score, and for a held or blocked run the
   checks that stopped it. Under it, the headline numbers in one strip, each with a meter where it is a share and what
   it means. The numbers appear once on the page.
3. **Tabs**, sticky while the page scrolls, the open one in the address: Overview (the questions, the guarantee for a
   public release, what remains, the gate at a glance, the timeline), Usefulness (each question with its score band,
   what changed and both answers side by side), Privacy (the engine's stronger attacker, then the scorecard risks by
   table), Columns (the settings Tune chose, then every column, filterable and searchable), Gate checks (every attempt,
   the deciding one open, failures first) and Records (a sample of the released rows; a pseudonym finds its other rows).

The page reads `/api/runs/:id/evidence/`, and each released table from `/api/runs/:id/records/:table/` only when it is
opened. The self-contained `dashboard.html` still ships inside the evidence download, for readers without the app.

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
| Landing demo | Four made-up visits go through the gate: Detect's scan tints each column by role, an attacker rings the clues that single one visit out, protection rewrites the cells column by column, and the release counts up its scores under a "Released" stamp. A thin line shows time to the next stage; hovering or focusing pauses it |
| Landing pipeline | A pulse travels along the six connected stages |

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

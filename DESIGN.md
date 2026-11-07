# Design

The visual system for the PETs Transformer web app and its evidence dashboard. Strategy and audience live in
[PRODUCT.md](PRODUCT.md). Tokens are defined once in `web/frontend/src/theme/` and mirrored as CSS variables in
`engine/src/pets_engine/report/templates/dashboard.html`.

## Visual theme

Calm, exact, trustworthy: an auditor's workspace. Quiet cool-neutral surfaces, one ink-blue accent for actions and the
current selection, status colours only for decisions. Panels are separated by a 1px border, never by a soft shadow.
Light and dark modes are equals; the app follows the system until the person picks one, and the embedded dashboard
follows the app.

## Colour

Restrained strategy, all in OKLCH. Neutrals carry a trace of the accent hue (262) so the page and accent belong together.

| Role | Light | Dark | Used for |
|---|---|---|---|
| `bg` | `oklch(0.985 0.003 262)` | `oklch(0.165 0.01 262)` | Page |
| `bg.panel` | `oklch(1 0 0)` | `oklch(0.2 0.011 262)` | Panels, cards, tables, inputs |
| `fg` | `oklch(0.21 0.015 262)` | `oklch(0.95 0.005 262)` | Text |
| `fg.muted` | `oklch(0.44 0.016 262)` | `oklch(0.76 0.012 262)` | Secondary text, at least 4.5:1 |
| `border` | `oklch(0.9 0.007 262)` | `oklch(0.29 0.013 262)` | Panel edges, dividers |
| `brand.solid` | `ink.700`, `oklch(0.42 0.14 262)` | `ink.400`, `oklch(0.7 0.13 262)` | Primary buttons, current step, chosen card |
| `brand.subtle` | `ink.50` | `oklch(0.25 0.045 262)` | Selected and hover tints |

Status colours (Chakra's green, orange and red palettes) mean released, held and blocked, and nothing else. Every status
also carries an icon and a word, so colour is never the only cue. Detect's roles have their own palette, icon and plain
name in `features/release/utils/role-words.ts`.

## Typography

One family: IBM Plex Sans for everything, IBM Plex Mono for identifiers (column keys, scenario and run IDs, scores, times).
Both are bundled with the app, so no font request leaves the machine; the dashboard falls back to the system sans.

- Page title: `3xl` (`2xl` on phones), semibold, letter-spacing `-0.02em`.
- Section heading: `lg` or `md`, semibold, `-0.01em`.
- Body: `md` for page descriptions, `sm` for most UI text, `xs` for hints. Prose capped at 65–70ch.
- Numbers use tabular figures.

## Shape and spacing

Radii: 4px (`l1`), 8px (`l2`, controls), 12px (`l3`, panels and cards); pills only for badges. Spacing follows Chakra's 4px
scale with more air between sections (`8`–`10`) than within them (`2`–`5`). Content is capped at Chakra's `6xl` container.

## Components

- **Stepper.** Four numbered steps with an icon, a title and a one-line hint. Done steps show a check and stay clickable.
- **Choice cards.** Datasets and scenarios are whole-card buttons; a chosen scenario gets the accent border and tint plus a check.
- **Verdict banner.** The gate's decision first, in its status colour with an icon, the word and one sentence.
- **KPI tiles.** Icon, label, a large tabular number, a thin meter for 0–1 values, and what the number means.
- **Score rows.** Question ID, the question, a band word (Same answer, Close, Rough, Broken), the score and a bar.
- **Timeline.** Each run stage with its icon, message and time.
- **States.** Skeletons while loading, an empty state that says what will appear, and inline alerts for errors.

## Iconography

Lucide only, at 12–20px, with `aria-hidden` when a word sits beside it. Icons label subjects (datasets), roles, statuses,
stages and actions; they never decorate.

## Motion

State only, 180–220ms with an ease-out curve: a new step or row rises 4px into place, score bars fill once, a running
status spins. `prefers-reduced-motion` collapses all of it to an instant change.

## Accessibility

WCAG 2.2 AA. Text contrast at least 4.5:1 in both modes, a 2px accent focus ring on every focusable element, real buttons
and radio semantics for card choices, `aria-live` on the run timeline, labels on every icon-only control, and layouts that
reflow from 375px phones to ultra-wide screens.

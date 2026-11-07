import { FileText, Filter, ScanSearch, ShieldCheck, Shuffle, SlidersHorizontal, type LucideIcon } from 'lucide-react'

/**
 * Everything the landing page says. Figures come from the README's results table: a self-assessment with the
 * challenge's pets-eval toolkit against its public attackers, not official judging scores. The demo rows are made up.
 */

/** The four moments of a release the hero animates, in order. */
export const DEMO_STAGES = [
  { tag: 'Detect', title: 'Every column, labelled',
    text: 'Detect reads each column from its values and its name: what identifies a person alone, the clues that do it together, private facts and free text.' },
  { tag: 'Attack', title: 'Names gone, people still found',
    text: 'Removing names is rarely enough. Age, postcode and a visit date single people out together, so the gate attacks the data the way an adversary would.' },
  { tag: 'Protect', title: 'Hidden among look-alikes',
    text: 'Keyed pseudonyms, coarser clues and layered text redaction. A row that still stands out loses one clue at a time, the one its questions need least.' },
  { tag: 'Release', title: 'HEALTH-S1: released and sealed',
    text: 'For a university research group: privacy 1.00, usefulness 0.99 and every row kept. A release that fails any check is blocked instead.' },
] as const

export const DEMO_STAGE = { detect: 0, attack: 1, protect: 2, release: 3 } as const

/** The demo table's columns, with the role Detect gives each one. */
export const DEMO_COLUMNS = [
  { key: 'name', label: 'Name', role: 'direct_identifier', technique: 'Removed' },
  { key: 'id', label: 'National ID', role: 'direct_identifier', technique: 'Keyed pseudonym' },
  { key: 'born', label: 'Born', role: 'quasi_identifier', technique: '10-year band' },
  { key: 'area', label: 'Area', role: 'quasi_identifier', technique: 'Large areas kept' },
  { key: 'arrived', label: 'Arrived', role: 'quasi_identifier', technique: 'Hour only' },
  { key: 'diagnosis', label: 'Diagnosis', role: 'sensitive_attribute', technique: 'Shorter code' },
] as const

export type DemoColumn = (typeof DEMO_COLUMNS)[number]['key']

/** The roles Detect finds in the demo table, once each, in column order. */
export const DEMO_ROLES = [...new Set(DEMO_COLUMNS.map((column) => column.role))]

/** Made-up emergency visits: the original values, then what the gate releases. */
export const DEMO_ROWS: { raw: Record<DemoColumn, string>; released: Record<DemoColumn, string> }[] = [
  { raw: { name: 'Aino Virtanen', id: '150387-114K', born: '15.03.1987', area: 'Turku', arrived: '14:32', diagnosis: 'J10.1' },
    released: { name: '', id: 'pt3f9a…c1', born: '30–39', area: 'Turku', arrived: '14:00', diagnosis: 'J10' } },
  { raw: { name: 'Mikko Laine', id: '020561-221H', born: '02.05.1961', area: 'Kaarina', arrived: '09:05', diagnosis: 'I21.4' },
    released: { name: '', id: 'pt8b21…07', born: '60–69', area: 'Kaarina', arrived: '09:00', diagnosis: 'I21' } },
  { raw: { name: 'Ella Korhonen', id: '281199-934R', born: '28.11.1999', area: 'Turku', arrived: '22:47', diagnosis: 'S52.5' },
    released: { name: '', id: 'pt5e0d…9a', born: '20–29', area: 'Turku', arrived: '22:00', diagnosis: 'S52' } },
  { raw: { name: 'Juha Nieminen', id: '090774-561A', born: '09.07.1974', area: 'Naantali', arrived: '11:18', diagnosis: 'K35.8' },
    released: { name: '', id: 'ptc47f…3e', born: '50–59', area: 'Naantali', arrived: '11:00', diagnosis: 'K35' } },
]

/** What the demo's attacker already knows about the first visit, before and after protection. */
export const ATTACKER = {
  knows: ['born 1987', 'lives in Turku', 'arrived 14:32'],
  before: 'One matching row. Aino is singled out, with no name in sight.',
  after: 'Every combination matches at least 5 visits in the full release. Nobody is singled out.',
}

export const RELEASE_FIGURES = [
  { label: 'Privacy', value: 1, format: 'score' },
  { label: 'Usefulness', value: 0.99, format: 'score' },
  { label: 'Rows kept', value: 1, format: 'percent' },
] as const

/** Usefulness against the challenge's own baselines (B2 classic, B3 differential privacy at ε 1). */
export const PROOF = [
  { id: 'HEALTH-S1', what: 'Hospital research release', ours: 0.99, baseline: 0.79 },
  { id: 'CS-S1', what: 'Contact-centre chats', ours: 0.97, baseline: 0.75 },
  { id: 'CYBER-S1', what: 'Security logs', ours: 0.99, baseline: 0.81 },
  { id: 'HEALTH-S2', what: 'Public dashboard, ε 1', ours: 0.74, baseline: 0.69 },
]

export const STAGES: { name: string; text: string; icon: LucideIcon; palette: string }[] = [
  { name: 'Detect', icon: ScanSearch, palette: 'blue',
    text: 'Labels every column from its values and name, and every piece of personal data in free text.' },
  { name: 'Select', icon: Filter, palette: 'purple',
    text: "Keeps only what the recipient's questions need, found by re-running them with columns removed." },
  { name: 'Tune', icon: SlidersHorizontal, palette: 'yellow',
    text: 'Searches age bands and time detail against the real question scores.' },
  { name: 'Transform', icon: Shuffle, palette: 'cyan',
    text: 'Keyed pseudonyms, generalisation, code shortening and text redaction, then a keyed shuffle.' },
  { name: 'Verify', icon: ShieldCheck, palette: 'brand',
    text: 'Compares the output with the original, runs the attacks, and releases, holds or blocks.' },
  { name: 'Report', icon: FileText, palette: 'accent',
    text: 'A dashboard, a field-by-field record and a plain-language summary.' },
]

export const RESULTS: { id: string; recipient: string; trust: string; gate: string; status: 'release' | 'review'; privacy: string; usefulness: string; rows: string }[] = [
  { id: 'HEALTH-S1', recipient: 'University research group', trust: 'controlled_research', gate: 'Released on attempt 2', status: 'release', privacy: '1.00', usefulness: '0.99', rows: '100%' },
  { id: 'CS-S1', recipient: 'AI vendor, contact-centre chats', trust: 'contractual', gate: 'Released', status: 'release', privacy: '1.00', usefulness: '0.97', rows: '100%' },
  { id: 'CYBER-S1', recipient: 'Managed security provider', trust: 'contractual', gate: 'Released', status: 'release', privacy: '0.32', usefulness: '0.99', rows: '100%' },
  { id: 'HEALTH-S2', recipient: 'Public dashboard', trust: 'public', gate: 'Released as 254 noisy answers, no rows', status: 'release', privacy: 'ε 1', usefulness: '0.74', rows: 'Answers only' },
  { id: 'unseen', recipient: 'Labour-market researchers', trust: 'controlled_research', gate: "Released on attempt 2, after a person's review", status: 'review', privacy: '–', usefulness: '0.98', rows: '100%' },
]

export const RISKS = [
  { title: 'Our stronger attacker', text: "The organisers' hidden attackers weren't available, so the engine runs its own. Adding every kept fact to the health release singles out 98% of visits." },
  { title: 'Repeat visits', text: "75% of patients with more than one visit have a unique pattern across them, which a row-level look-alike check can't see." },
  { title: 'Cyber logs', text: 'Privacy is 0.32 because detection rules need minute-level timestamps, and the scenario sets no look-alike bar.' },
  { title: 'Public answers', text: 'The budget is per release, so weekly releases about the same people add up. A public scenario with no question list is still blocked.' },
]

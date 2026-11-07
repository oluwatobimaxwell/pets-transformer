import { FileText, Filter, ScanSearch, ShieldCheck, Shuffle, SlidersHorizontal, type LucideIcon } from 'lucide-react'
import { IDLE_SCENE, type CoreScene } from '@/shared/components/core-model'

/**
 * Everything the landing page says. Figures come from the README's results table: a self-assessment with the
 * challenge's pets-eval toolkit against its public attackers, not official judging scores.
 */

export const DEMO: { tag: string; title: string; text: string; scene: CoreScene }[] = [
  {
    tag: 'Detect',
    title: 'Every column, labelled',
    text: 'Detect reads each column from its values and its name: what identifies a person alone, the clues that do it together, private facts and free text.',
    scene: {
      ...IDLE_SCENE,
      mode: 'classes',
      layers: [
        { color: '#FD550A', share: 0.14 },
        { color: '#F2B544', share: 0.1 },
        { color: '#8DB8DF', share: 0.3 },
        { color: '#E98AB4', share: 0.16 },
        { color: '#8FD3B6', share: 0.3 },
      ],
    },
  },
  {
    tag: 'Attack',
    title: 'Names gone, people still found',
    text: 'Removing names is rarely enough. Age, postcode and a visit date single people out together, so the gate attacks the data the way an adversary would.',
    scene: { ...IDLE_SCENE, mode: 'exposed', exposed: 0.55 },
  },
  {
    tag: 'Protect',
    title: 'Hidden among look-alikes',
    text: 'Keyed pseudonyms, coarser clues and layered text redaction. A row that still stands out loses one clue at a time, the one its questions need least.',
    scene: { ...IDLE_SCENE, mode: 'grouped', k: 5, protect: true },
  },
  {
    tag: 'Release',
    title: 'HEALTH-S1: released and sealed',
    text: 'For a university research group: privacy 1.00, usefulness 0.99 and every row kept. A release that fails any check is blocked instead.',
    scene: { ...IDLE_SCENE, mode: 'grouped', k: 5, protect: true, seal: 2 },
  },
]

/** Usefulness against the challenge's own baselines (B2 classic, B3 differential privacy at ε 1). */
export const PROOF = [
  { id: 'HEALTH-S1', ours: 0.99, baseline: 0.79 },
  { id: 'CS-S1', ours: 0.97, baseline: 0.75 },
  { id: 'CYBER-S1', ours: 0.99, baseline: 0.81 },
  { id: 'HEALTH-S2', ours: 0.74, baseline: 0.69, note: 'ε 1, average of 10 runs' },
]

export const STAGES: { name: string; text: string; icon: LucideIcon; palette: string }[] = [
  { name: 'Detect', icon: ScanSearch, palette: 'blue',
    text: 'Labels every column from its values and name, and every piece of personal data in free text.' },
  { name: 'Select', icon: Filter, palette: 'purple',
    text: "Keeps only what the recipient's questions need, found by re-running them with columns removed." },
  { name: 'Tune', icon: SlidersHorizontal, palette: 'yellow',
    text: 'Searches age bands and time detail against the real question scores, and brings a safe column back if a question breaks.' },
  { name: 'Transform', icon: Shuffle, palette: 'cyan',
    text: 'Keyed pseudonyms, generalisation, code shortening and layered text redaction, then shuffles rows so their order reveals nothing.' },
  { name: 'Verify', icon: ShieldCheck, palette: 'brand',
    text: 'Compares the output with the original, runs the attacks, and returns release, review or block.' },
  { name: 'Report', icon: FileText, palette: 'accent',
    text: 'Writes a dashboard, a field-by-field record and a plain-language summary for the recipient.' },
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

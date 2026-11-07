import type { PROOF } from '../content'

/** The two bars drawn for one scenario: ours in forest, the challenge baseline in a quiet grey-green. */
export function proofBars(item: (typeof PROOF)[number]) {
  return [
    { label: 'PETs Transformer', value: item.ours, color: 'forest.300', strong: true },
    { label: 'Challenge baseline', value: item.baseline, color: 'rgba(163,194,183,0.45)', strong: false },
  ]
}

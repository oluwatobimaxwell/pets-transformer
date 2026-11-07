import { FileUp, FlaskConical } from 'lucide-react'
import type { ChoiceOption } from '../components/choice-cards'

export type DataSource = 'sample' | 'upload'

/** The two ways to bring data into a release, as the first step offers them. */
export const DATA_SOURCES: ChoiceOption<DataSource>[] = [
  { value: 'sample', label: 'Challenge dataset', icon: FlaskConical, badge: 'Recommended',
    text: 'Synthetic data from the challenge package, with ready-made recipients. The quickest way to see the gate work.' },
  { value: 'upload', label: 'Your own CSV files', icon: FileUp,
    text: 'Each file becomes one table, and files that share a column, such as a customer ID, are treated as linked.' },
]

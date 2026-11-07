/** The two states of a run's data the rail can show: as it came in, and as the gate left it. */
export type DataSide = 'original' | 'protected'

export const DATA_SIDES: { value: DataSide; label: string }[] = [
  { value: 'original', label: 'Original' },
  { value: 'protected', label: 'Protected' },
]

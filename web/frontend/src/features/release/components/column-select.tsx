import { NativeSelect } from '@chakra-ui/react'

interface ColumnSelectProps {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  placeholder: string
  label: string
}

/** Picks one column, written as table.column. */
export function ColumnSelect({ value, options, onChange, placeholder, label }: ColumnSelectProps) {
  return (
    <NativeSelect.Root size="sm" width="auto" minW="44">
      <NativeSelect.Field value={value} onChange={(event) => onChange(event.currentTarget.value)} aria-label={label}>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  )
}

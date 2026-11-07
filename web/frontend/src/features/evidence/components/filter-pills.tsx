import { Button, HStack, Text } from '@chakra-ui/react'

interface FilterPillsProps<T extends string> {
  label: string
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
}

/** A row of toggle buttons for choosing one view, each with its count. */
export function FilterPills<T extends string>({ label, options, value, onChange }: FilterPillsProps<T>) {
  return (
    <HStack role="group" aria-label={label} gap="1" p="1" bg="bg.muted" rounded="l2" flexWrap="wrap" alignSelf="start">
      {options.map((option) => {
        const on = option.value === value
        return (
          <Button key={option.value} size="xs" variant="ghost" rounded="l1" aria-pressed={on} onClick={() => onChange(option.value)}
            bg={on ? 'bg.panel' : 'transparent'} color={on ? 'fg' : 'fg.muted'} boxShadow={on ? 'xs' : undefined} fontWeight={on ? 'semibold' : 'medium'}
            _hover={{ color: 'fg', bg: on ? 'bg.panel' : 'bg.subtle' }}>
            {option.label}
            {option.count !== undefined && <Text as="span" fontFamily="mono" color="fg.subtle" fontWeight="medium">{option.count.toLocaleString('en-US')}</Text>}
          </Button>
        )
      })}
    </HStack>
  )
}

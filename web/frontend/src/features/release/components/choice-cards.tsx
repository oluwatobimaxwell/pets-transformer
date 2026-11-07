import { Badge, Box, Circle, Grid, HStack, Stack, Text } from '@chakra-ui/react'
import { Check, type LucideIcon } from 'lucide-react'

export interface ChoiceOption<T extends string> {
  value: T
  label: string
  text: string
  icon: LucideIcon
  badge?: string
}

interface ChoiceCardsProps<T extends string> {
  options: ChoiceOption<T>[]
  value: T
  onChange: (value: T) => void
  /** What the group decides, for screen readers. */
  label: string
  columns?: { base?: string; md?: string; xl?: string }
}

/** A choice between a few options, as large cards with an icon and a sentence each, behaving like radio buttons. */
export function ChoiceCards<T extends string>({ options, value, onChange, label, columns = { base: '1fr', md: '1fr 1fr' } }: ChoiceCardsProps<T>) {
  return (
    <Grid role="radiogroup" aria-label={label} templateColumns={columns} gap="3">
      {options.map((option) => {
        const selected = option.value === value
        const OptionIcon = option.icon
        return (
          <Box asChild key={option.value} textAlign="start" rounded="l3" p="5" borderWidth="1.5px" transition="border-color 180ms, background 180ms"
            borderColor={selected ? 'brand.solid' : 'border'} bg={selected ? 'brand.subtle' : 'bg.panel'} _hover={selected ? undefined : { borderColor: 'border.emphasized' }}>
            <button type="button" role="radio" aria-checked={selected} onClick={() => onChange(option.value)}>
              <HStack gap="4" align="start">
                <Circle size="11" flexShrink="0" bg={selected ? 'brand.solid' : 'bg.muted'} color={selected ? 'brand.contrast' : 'fg'} transition="background 180ms">
                  <OptionIcon size={20} aria-hidden="true" />
                </Circle>
                <Stack gap="1" flex="1" minW="0">
                  <HStack gap="2" flexWrap="wrap">
                    <Text fontWeight="semibold">{option.label}</Text>
                    {option.badge && <Badge colorPalette="brand" variant="subtle" size="sm">{option.badge}</Badge>}
                  </HStack>
                  <Text textStyle="sm" color="fg.muted">{option.text}</Text>
                </Stack>
                <Circle size="5" flexShrink="0" borderWidth="1.5px" borderColor={selected ? 'brand.solid' : 'border.emphasized'} bg={selected ? 'brand.solid' : 'transparent'}
                  color="brand.contrast" aria-hidden="true">
                  {selected && <Check size={12} strokeWidth={3} />}
                </Circle>
              </HStack>
            </button>
          </Box>
        )
      })}
    </Grid>
  )
}

import { Box, HStack } from '@chakra-ui/react'
import { DATA_SIDES, type DataSide } from '../utils/data-sides'

/** Switches the model between the data as it came in and as the gate left it. */
export function DataSideSwitch({ side, onChange }: { side: DataSide; onChange: (side: DataSide) => void }) {
  return (
    <HStack role="group" aria-label="Show the data" gap="0.5" p="0.5" rounded="full" bg="deep" borderWidth="1px" borderColor="deep.line">
      {DATA_SIDES.map((option) => {
        const on = option.value === side
        return (
          <Box key={option.value} asChild px="2.5" py="0.5" rounded="full" textStyle="xs" fontWeight="semibold" transition="background 200ms, color 200ms"
            bg={on ? (option.value === 'original' ? 'mandarin.500' : 'forest.300') : 'transparent'} color={on ? 'black' : 'deep.muted'}
            _hover={on ? undefined : { color: 'deep.fg' }}>
            <button type="button" aria-pressed={on} onClick={() => onChange(option.value)}>{option.label}</button>
          </Box>
        )
      })}
    </HStack>
  )
}

import { Box, Grid, HStack, Text } from '@chakra-ui/react'
import { roleWord } from '@/features/release/utils/role-words'
import { DEMO_COLUMNS, DEMO_ROWS, DEMO_STAGE } from '../content'
import { CLUE_COLUMNS, cellTint, cellValue } from '../utils/demo-cells'

const TEMPLATE = '1.15fr 1.2fr 1fr 0.85fr 0.7fr 0.75fr'

interface GateTableProps {
  stage: number
  /** What the table shows at this stage, for screen readers. */
  label: string
}

/**
 * Four made-up emergency visits as the gate sees them. Detect tints each column by its role, the attacker singles out
 * the first visit from its clues alone, protection rewrites the cells one column after another, and the release
 * leaves every row in place.
 */
export function GateTable({ stage, label }: GateTableProps) {
  const protectedView = stage >= DEMO_STAGE.protect
  return (
    <Box role="img" aria-label={label} position="relative" overflowX="auto" rounded="l2" borderWidth="1px" borderColor="deep.line" bg="rgba(234,243,239,0.025)">
      {stage === DEMO_STAGE.detect && (
        <Box aria-hidden="true" position="absolute" insetX="0" h="40%" pointerEvents="none" animation="scan 2.6s cubic-bezier(0.45, 0, 0.55, 1) infinite"
          bgGradient="to-b" gradientFrom="transparent" gradientVia="rgba(143,211,182,0.10)" gradientTo="transparent" />
      )}
      <Grid templateColumns={TEMPLATE} minW="520px" fontSize={{ base: 'xs', md: 'sm' }}>
        {DEMO_COLUMNS.map((column) => {
          const role = roleWord(column.role)
          return (
            <Box key={column.key} px="3" py="2.5" borderBottomWidth="1px" borderColor="deep.line">
              <Text fontWeight="semibold" color="deep.fg" fontSize="xs">{column.label}</Text>
              <HStack gap="1.5" mt="1" color="deep.muted" fontSize="2xs" minW="0">
                <Box boxSize="1.5" rounded="full" bg={protectedView ? 'forest.300' : role.hex} flexShrink="0" />
                <Text as="span" truncate>{protectedView ? column.technique : role.label}</Text>
              </HStack>
            </Box>
          )
        })}
        {DEMO_ROWS.map((row, rowIndex) => {
          const target = rowIndex === 0
          const singledOut = stage === DEMO_STAGE.attack && target
          return DEMO_COLUMNS.map((column, columnIndex) => {
            const value = cellValue(stage, column.key, row)
            const clue = CLUE_COLUMNS.includes(column.key)
            const tint = cellTint(stage, column.role, singledOut)
            const ring = (singledOut || (stage === DEMO_STAGE.release && target)) && clue
            return (
              <Box key={`${rowIndex}-${column.key}`} px="3" py="2.5" bg={tint} transition="background 400ms, opacity 400ms"
                opacity={stage === DEMO_STAGE.attack && !target ? 0.45 : 1} borderBottomWidth={rowIndex < DEMO_ROWS.length - 1 ? '1px' : '0'} borderColor="rgba(29,74,62,0.6)">
                <Box key={`${protectedView}-${stage === DEMO_STAGE.attack}`} display="inline-flex" alignItems="center" maxW="full"
                  animation={`rise 420ms cubic-bezier(0.2, 0.8, 0.2, 1) ${protectedView ? columnIndex * 90 + rowIndex * 40 : 0}ms backwards`}
                  rounded="l1" outline={ring ? '1.5px solid' : 'none'} outlineOffset="3px" outlineColor={singledOut ? 'mandarin.500' : 'forest.300'}>
                  {value ? (
                    <Text truncate fontSize={{ base: 'xs', md: 'sm' }} letterSpacing={column.key === 'name' || column.key === 'area' ? 'normal' : '-0.02em'} fontFamily={column.key === 'name' || column.key === 'area' ? 'body' : 'mono'}
                      color={column.key === 'id' && protectedView ? 'forest.300' : 'deep.fg'}>{value}</Text>
                  ) : (
                    <Box h="2" w="16" rounded="full" bg="rgba(163,194,183,0.22)" title="Removed" />
                  )}
                </Box>
              </Box>
            )
          })
        })}
      </Grid>
    </Box>
  )
}

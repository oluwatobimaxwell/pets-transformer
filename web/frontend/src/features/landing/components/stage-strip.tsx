import { Box, HStack, Stack, Text } from '@chakra-ui/react'
import { CircleAlert, ShieldCheck } from 'lucide-react'
import { roleWord } from '@/features/release/utils/role-words'
import { formatPercent, formatScore } from '@/features/release/utils/format-score'
import { CountUp } from '@/shared/components/motion/count-up'
import { ATTACKER, DEMO_COLUMNS, DEMO_ROLES, DEMO_STAGE, RELEASE_FIGURES } from '../content'
import { DemoChip as Chip } from './demo-chip'

/** What just happened in the demo, in one line under the table: roles found, the attack, the techniques, the release. */
export function StageStrip({ stage }: { stage: number }) {
  return (
    <Box key={stage} minH={{ base: "32", md: "24" }} animation="rise 380ms cubic-bezier(0.2, 0.8, 0.2, 1)">
      {stage === DEMO_STAGE.detect && (
        <HStack gap="2" flexWrap="wrap">
          {DEMO_ROLES.map((role) => {
            const word = roleWord(role)
            const count = DEMO_COLUMNS.filter((column) => column.role === role).length
            return <Chip key={role}><Box boxSize="2" rounded="full" bg={word.hex} />{count} × {word.label.toLowerCase()}</Chip>
          })}
        </HStack>
      )}
      {stage === DEMO_STAGE.attack && (
        <Stack gap="2">
          <HStack gap="2" flexWrap="wrap"><Text fontSize="xs" color="deep.muted">An attacker knows</Text>{ATTACKER.knows.map((fact) => <Chip key={fact}>{fact}</Chip>)}</HStack>
          <HStack gap="2" color="mandarin.300" fontSize="sm"><CircleAlert size={15} aria-hidden="true" />{ATTACKER.before}</HStack>
        </Stack>
      )}
      {stage === DEMO_STAGE.protect && (
        <HStack gap="2" flexWrap="wrap">
          {DEMO_COLUMNS.map((column) => <Chip key={column.key} tone="safe">{column.label}<Text as="span" color="deep.muted">→</Text>{column.technique.toLowerCase()}</Chip>)}
        </HStack>
      )}
      {stage === DEMO_STAGE.release && (
        <HStack gap={{ base: '4', md: '6' }} align="center" flexWrap="wrap">
          {RELEASE_FIGURES.map((figure) => (
            <Stack key={figure.label} gap="0">
              <Text fontSize="xs" color="deep.muted">{figure.label}</Text>
              <Text fontFamily="mono" fontSize="2xl" fontWeight="medium" color="forest.300" lineHeight="1.1">
                <CountUp value={figure.value} format={figure.format === 'score' ? formatScore : formatPercent} ms={900} />
              </Text>
            </Stack>
          ))}
          <HStack gap="2" px="3" py="1.5" rounded="l2" borderWidth="1.5px" borderColor="forest.300" color="forest.300" fontWeight="bold" fontSize="sm"
            letterSpacing="0.06em" animation="stamp 600ms cubic-bezier(0.2, 0.8, 0.2, 1) 250ms backwards" ms={{ md: 'auto' }}>
            <ShieldCheck size={16} aria-hidden="true" />RELEASED
          </HStack>
          <Text flexBasis="full" fontSize="sm" color="deep.muted">{ATTACKER.after}</Text>
        </HStack>
      )}
    </Box>
  )
}

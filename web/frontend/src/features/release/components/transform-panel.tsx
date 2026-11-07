import { useState } from 'react'
import { Badge, Box, Button, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, RotateCcw } from 'lucide-react'
import type { RunOut } from '@/api/generated'
import { useRunPreview } from '../hooks/use-run-preview'
import { statusWord } from '../utils/status-words'
import { phaseWords, transformPhase } from '../utils/transform-phase'
import { TransformSkeleton } from './transform-skeleton'
import { TransformTable } from './transform-table'

/**
 * The run as the data shows it: the first rows of the main table, the technique the gate picked for each column, and
 * each value turning from original to protected as the gate writes it. Follows the gate while it works.
 */
export function TransformPanel({ run }: { run: RunOut }) {
  const word = statusWord(run.status)
  const { data: preview } = useRunPreview(run.id, word.finished)
  const [replay, setReplay] = useState(0)
  const phase = transformPhase(run, preview)
  const words = phaseWords(phase, run.status)
  const hasRows = Boolean(preview?.columns.length)
  const turned = Boolean(preview?.columns.some((column) => column.after))
  const StatusIcon = word.icon
  return (
    <Stack as="section" aria-labelledby="transform-title" gap="0" rounded="l3" borderWidth="1px" borderColor="border" bg="bg.panel" overflow="hidden">
      <Flex gap="4" p={{ base: '4', md: '5' }} justify="space-between" align={{ base: 'start', md: 'center' }} direction={{ base: 'column', md: 'row' }}
        borderBottomWidth={phase === 'answers' ? '0' : '1px'} borderColor="border">
        <HStack gap="3" align="start" minW="0">
          <Box pt="1" flexShrink="0" color={phase === 'decided' ? `${word.palette}.fg` : undefined}>
            {phase === 'decided' ? <StatusIcon size={18} aria-hidden="true" /> : <Box as="span" className="spin3d" aria-hidden="true"><i /><i /></Box>}
          </Box>
          <Stack gap="0.5" minW="0" aria-live="polite">
            <Text id="transform-title" fontWeight="semibold">{words.title}</Text>
            <Text textStyle="sm" color="fg.muted" maxW="70ch">{words.says}</Text>
          </Stack>
        </HStack>
        {hasRows && (
          <HStack gap="3" flexShrink="0">
            {preview?.synthetic ? (
              <HStack gap="1.5" textStyle="xs" color="fg.muted">
                <Badge variant="subtle" colorPalette="gray">Original</Badge>
                <ArrowRight size={12} aria-hidden="true" />
                <Badge variant="subtle" colorPalette="brand">Protected</Badge>
              </HStack>
            ) : (
              <Badge variant="subtle" colorPalette="brand">Protected values only</Badge>
            )}
            {turned && (
              <Button size="xs" variant="outline" onClick={() => setReplay((count) => count + 1)}>
                <RotateCcw aria-hidden="true" />Replay
              </Button>
            )}
          </HStack>
        )}
      </Flex>
      {phase !== 'answers' && (hasRows && preview ? <TransformTable preview={preview} replay={replay} scanning={phase === 'protecting'} /> : <TransformSkeleton />)}
      {hasRows && preview && (
        <Text textStyle="xs" color="fg.muted" px={{ base: '4', md: '5' }} py="3" borderTopWidth="1px" borderColor="border" bg="bg.subtle">
          The first {preview.rows} rows of <Text as="span" fontFamily="mono">{preview.table}</Text>, the table with the most columns that leave.{' '}
          {preview.synthetic
            ? 'This is challenge sample data about fictional people, so the original values are shown beside the protected ones. For your own data, only protected values appear.'
            : 'Original values of your own data never leave the engine, so only the protected values appear.'}
        </Text>
      )}
    </Stack>
  )
}

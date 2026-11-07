import { Link, useParams } from 'react-router-dom'
import { Box, Button, Grid, Heading, HStack, Skeleton, Stack, Text } from '@chakra-ui/react'
import { ArrowRight, Plus } from 'lucide-react'
import { buildPath, Path } from '@/router/paths'
import { StatusAlert } from '@/shared/components/status-alert'
import { GateTracker, RunProgress, statusWord, TransformPanel, useRun, useStartOver } from '@/features/release'
import { useEvidence, VerdictPanel } from '@/features/evidence'

/**
 * The wizard's last screen: the data turning from original to protected as the gate works through its stages, then its
 * decision with the headline numbers and a way into the release's own page, where the full evidence lives.
 */
export default function RunningPage() {
  const { runId = '' } = useParams()
  const { data: run, isLoading, errorMessage } = useRun(runId)
  const decided = Boolean(run && statusWord(run.status).finished && run.status !== 'error')
  const { data: evidence } = useEvidence(runId, decided)
  const startNew = useStartOver()
  if (isLoading) {
    return (
      <Stack gap="6" maxW="4xl" mx="auto" px={{ base: '4', md: '8' }} py="10" aria-busy="true" aria-label="Loading the run">
        <Skeleton h="10" w="72" rounded="l2" />
        <Skeleton h="72" rounded="l3" />
      </Stack>
    )
  }
  if (errorMessage || !run) {
    return (
      <Stack gap="4" align="start" maxW="4xl" mx="auto" px={{ base: '4', md: '8' }} py="10">
        <StatusAlert message={errorMessage ?? 'Run not found.'} />
        <Button asChild variant="outline"><Link to={Path.Runs}>Go to runs and results</Link></Button>
      </Stack>
    )
  }
  const finished = statusWord(run.status).finished
  return (
    <Box px={{ base: '4', md: '8', xl: '12' }} py={{ base: '6', md: '10' }}>
      <Stack gap={{ base: '6', md: '8' }} maxW="7xl" mx="auto">
        <Stack gap="3" maxW="3xl" className="stagger">
          <Text textStyle="sm" fontWeight="semibold" color="accent.fg">Release for <Text as="span" fontFamily="mono">{run.scenario_id}</Text></Text>
          <Heading as="h1" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" letterSpacing="-0.025em" lineHeight="1.1">
            {finished ? 'The gate has decided' : 'The gate is working'}
          </Heading>
          <Text color="fg.muted" textStyle={{ base: 'md', md: 'lg' }} lineHeight="1.6">
            {finished
              ? 'Here is the decision and the numbers behind it. The release page holds the protected data, every field and the full evidence.'
              : "It protects the data, then attacks it the way an adversary would and asks the recipient's questions of it. The health sample takes about a minute."}
          </Text>
        </Stack>

        {run.status === 'error' && <StatusAlert message={run.error || 'The run failed.'} />}
        {evidence && <VerdictPanel evidence={evidence} />}

        <TransformPanel run={run} />

        <Grid templateColumns={{ base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) minmax(0, 1fr)' }} gap="6" alignItems="start">
          <Box p={{ base: '5', md: '6' }} rounded="l3" borderWidth="1px" borderColor="border" bg="bg.panel">
            <GateTracker events={run.events} finished={finished} />
          </Box>
          <Stack gap="4">
            {finished ? (
              <Stack gap="3" p={{ base: '5', md: '6' }} rounded="l3" borderWidth="1px" borderColor="border" bg="bg.panel">
                <Text fontWeight="semibold">What next</Text>
                <Text textStyle="sm" color="fg.muted">Open the release to download the protected data and its evidence, and to see how each column was treated and each question scored.</Text>
                <HStack gap="2" flexWrap="wrap" pt="1">
                  <Button asChild size="lg"><Link to={buildPath(Path.Run, { runId: run.id })}>Open the release<ArrowRight aria-hidden="true" /></Link></Button>
                  <Button size="lg" variant="outline" onClick={startNew}><Plus aria-hidden="true" />Start a new release</Button>
                </HStack>
              </Stack>
            ) : (
              <Text textStyle="sm" color="fg.muted" p="1">You can leave this screen: the gate keeps working, and the run appears under runs and results when it decides.</Text>
            )}
            <Box as="details" p="4" rounded="l3" borderWidth="1px" borderColor="border" bg="bg.panel">
              <Box as="summary" cursor="pointer" textStyle="sm" fontWeight="medium">The engine's log</Box>
              <Box mt="4"><RunProgress events={run.events} running={!finished} /></Box>
            </Box>
          </Stack>
        </Grid>
      </Stack>
    </Box>
  )
}

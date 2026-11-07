import { Box } from '@chakra-ui/react'
import { LandingCta, LandingFooter, LandingHeader, LandingHero, LandingSection, Pipeline, ProofStrip, ResultsTable, RiskList } from '@/features/landing'

/** The landing page: the gate working on four visits, the proof against the challenge baseline, how it works, results and limits. */
export default function LandingPage() {
  return (
    <Box minH="100dvh" bg="bg">
      <Box asChild position="absolute" left="4" top="-20" zIndex="skipLink" bg="accent.solid" color="accent.contrast" px="4" py="2" rounded="l2" fontWeight="semibold"
        _focus={{ top: '3' }}>
        <a href="#landing-main">Skip to content</a>
      </Box>
      <LandingHeader />
      <Box as="main" id="landing-main" tabIndex={-1} outline="none">
        <LandingHero />
        <ProofStrip />
        <LandingSection id="how" title="Removing names is rarely enough"
          lead="Age, postcode and a visit date look harmless. Together they single people out. The gate measures that risk on your data, protects each column the way it needs, and stops before the data loses what it was shared for.">
          <Pipeline />
        </LandingSection>
        <LandingSection id="results" raised title="Protection set by who receives the data"
          lead="The same engine, five recipients. Each scenario carries its own limits and questions, and the gate checks the release against them. These are self-assessed scores, not official judging scores.">
          <ResultsTable />
        </LandingSection>
        <LandingSection id="risks" title="Risks that remain"
          lead="The gate reports what it couldn't rule out, so the person releasing the data decides with the full picture.">
          <RiskList />
        </LandingSection>
        <LandingCta />
      </Box>
      <LandingFooter />
    </Box>
  )
}

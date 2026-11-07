import type { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { SectionHead } from './section-head'

interface LandingSectionProps {
  id: string
  title: string
  lead: string
  /** A raised band, to set one section apart from its neighbours. */
  raised?: boolean
  children: ReactNode
}

/** One section below the hero: an anchor for the header links, a title with its lead, then the content. */
export function LandingSection({ id, title, lead, raised = false, children }: LandingSectionProps) {
  return (
    <Box as="section" id={id} aria-labelledby={`${id}-title`} py={{ base: '16', md: '24' }} scrollMarginTop="16"
      bg={raised ? 'bg.panel' : undefined} borderTopWidth={raised ? '1px' : undefined} borderBottomWidth={raised ? '1px' : undefined} borderColor="border">
      <Container maxW="7xl">
        <SectionHead id={`${id}-title`} title={title} lead={lead} />
        {children}
      </Container>
    </Box>
  )
}

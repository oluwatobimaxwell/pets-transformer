import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Box, Button, Circle, Container, Flex, Grid, Heading, HStack, SimpleGrid, Stack, Table, Text } from '@chakra-ui/react'
import { ArrowRight, BookOpen, CircleAlert, CircleCheck, Lock, Upload } from 'lucide-react'
import { Path } from '@/router/paths'
import { BrandLogo } from '@/shared/components/brand-logo'
import { CoreModel } from '@/shared/components/core-model'
import { ColorModeButton } from '@/shared/components/ui/color-mode-button'
import { API_URL } from '@/shared/utils/api-url'
import { trustWord } from '@/features/release/utils/trust-words'
import { DEMO, PROOF, RESULTS, RISKS, STAGES } from './landing-content'

const SAMPLE_LINK = `${Path.ReleaseData}?sample=health`

const ON_DEEP_OUTLINE = {
  variant: 'outline' as const,
  bg: 'transparent',
  color: 'deep.fg',
  borderColor: 'rgba(234,243,239,0.35)',
  boxShadow: 'none',
  _hover: { bg: 'rgba(234,243,239,0.06)', borderColor: 'deep.fg' },
}

/** The hero's live model: four stages of a release, auto-advancing until the person picks one. */
function Demo() {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    if (!auto || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % DEMO.length), 4200)
    return () => clearInterval(timer)
  }, [auto])

  const pick = (next: number) => {
    setIndex(next)
    setAuto(false)
  }
  // Arrow keys move between tabs, as for any tab list
  const onKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (index + step + DEMO.length) % DEMO.length
    pick(next)
    tabs.current[next]?.focus()
  }
  const stage = DEMO[index]!

  return (
    <Box as="figure" m="0" rounded="22px" borderWidth="1px" borderColor="deep.line" overflow="hidden" bgGradient="to-b" gradientFrom="deep.raised" gradientTo="deep">
      <CoreModel scene={stage.scene} label={`${stage.title}. ${stage.text}`} aspect={1.25} />
      <Stack as="figcaption" gap="3" px="4.5" pt="3.5" pb="4.5" borderTopWidth="1px" borderColor="deep.line">
        <Flex role="tablist" aria-label="How a release goes" gap="1" wrap="wrap" onKeyDown={onKey}>
          {DEMO.map((item, n) => {
            const selected = n === index
            return (
              <Box asChild key={item.tag} display="inline-flex" gap="2" alignItems="center" px="3" py="1.5" rounded="l2" fontSize="sm" fontWeight="semibold"
                borderWidth="1px" borderColor={selected ? 'deep.line' : 'transparent'} bg={selected ? 'deep.raised' : 'transparent'}
                color={selected ? 'white' : 'deep.muted'} transition="background 200ms, color 200ms" _hover={{ color: 'white' }}>
                <button ref={(el) => { tabs.current[n] = el }} type="button" role="tab" id={`demo-tab-${n}`} aria-controls="demo-panel"
                  aria-selected={selected} tabIndex={selected ? 0 : -1} onClick={() => pick(n)}>
                  <Text as="span" fontFamily="mono" fontSize="xs" color={selected ? 'mandarin.500' : 'inherit'}>{String(n + 1).padStart(2, '0')}</Text>
                  {item.tag}
                </button>
              </Box>
            )
          })}
        </Flex>
        <Box id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${index}`} key={index} minH="5.4em" animation="rise 450ms var(--chakra-easings-out)" aria-live="polite">
          <Text fontWeight="semibold" fontSize="lg" color="white">{stage.title}</Text>
          <Text mt="1" fontSize="sm" lineHeight="1.55" color="deep.muted">{stage.text}</Text>
        </Box>
      </Stack>
    </Box>
  )
}

function SectionHead({ id, kicker, title, lead }: { id: string; kicker: string; title: string; lead: string }) {
  return (
    <Stack gap="3" mb={{ base: '8', md: '10' }} maxW="3xl">
      <Text fontFamily="mono" fontSize="sm" fontWeight="medium" color="accent.fg">{kicker}</Text>
      <Heading as="h2" id={id} fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" letterSpacing="display" lineHeight="1.1">{title}</Heading>
      <Text fontSize={{ base: 'md', md: 'lg' }} color="fg.muted">{lead}</Text>
    </Stack>
  )
}

/** The landing page: what the gate does, a live 3D demo, the results it reached, and the risks that remain. */
export default function LandingPage() {
  return (
    <Box minH="100dvh" bg="bg">
      <Box asChild position="absolute" left="4" top="-20" zIndex="skipLink" bg="accent.solid" color="accent.contrast" px="4" py="2" rounded="l2" fontWeight="semibold"
        _focus={{ top: '3' }}>
        <a href="#landing-main">Skip to content</a>
      </Box>

      <Box as="header" position="sticky" top="0" zIndex="sticky" bg="rgba(5,35,28,0.94)" backdropFilter="blur(10px)" borderBottomWidth="1px" borderColor="deep.line">
        <Container maxW="7xl">
          <HStack h="16" gap="6">
            <BrandLogo onDeep />
            <HStack as="nav" aria-label="Sections" gap="6" ms="auto" hideBelow="md" fontSize="sm">
              {[['#how', 'How it works'], ['#results', 'Results'], ['#risks', 'Risks that remain']].map(([href, label]) => (
                <Box asChild key={href} color="deep.muted" _hover={{ color: 'white' }} transition="color 180ms"><a href={href}>{label}</a></Box>
              ))}
            </HStack>
            <HStack gap="2" ms={{ base: 'auto', md: '0' }}>
              <ColorModeButton color="deep.muted" _hover={{ bg: 'deep.raised', color: 'white' }} />
              <Button asChild size="sm" colorPalette="accent">
                <Link to={Path.ReleaseData}>Open the studio<ArrowRight aria-hidden="true" /></Link>
              </Button>
            </HStack>
          </HStack>
        </Container>
      </Box>

      <Box as="main" id="landing-main" tabIndex={-1} outline="none">
        <Box as="section" aria-labelledby="hero-title" bg="deep" color="deep.fg" py={{ base: '12', md: '16', lg: '20' }}>
          <Container maxW="7xl">
            <Grid templateColumns={{ base: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1.05fr)' }} gap={{ base: '10', lg: '14' }} alignItems="center">
              <Stack gap="6" className="stagger">
                <Badge alignSelf="start" size="lg" bg="deep.raised" color="forest.300" borderWidth="1px" borderColor="deep.line">
                  <Lock size={13} aria-hidden="true" />A privacy release gate that runs on your machine
                </Badge>
                <Heading as="h1" id="hero-title" color="white" fontSize={{ base: '4xl', md: '6xl', xl: '7xl' }} lineHeight="1" letterSpacing="-0.03em" fontWeight="bold">
                  Protect the data.<br />Prove it still works.
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.6" color="deep.muted" maxW="52ch">
                  Tell it who will receive a dataset. It protects the data, proves the data is still useful for that recipient, and blocks any release that fails.
                </Text>
                <HStack gap="3" flexWrap="wrap">
                  <Button asChild size="lg" colorPalette="accent">
                    <Link to={SAMPLE_LINK}>Try the healthcare sample<ArrowRight aria-hidden="true" /></Link>
                  </Button>
                  <Button asChild size="lg" {...ON_DEEP_OUTLINE}>
                    <Link to={Path.ReleaseData}><Upload aria-hidden="true" />Upload your own data</Link>
                  </Button>
                </HStack>
                <Text fontSize="sm" color="deep.muted">CSV files. No sign-in, and no outside service or language model ever sees the data.</Text>
              </Stack>
              <Demo />
            </Grid>
          </Container>
        </Box>

        <Box as="section" aria-labelledby="proof-title" bg="deep.raised" color="deep.fg" borderTopWidth="1px" borderBottomWidth="1px" borderColor="deep.line" py="6">
          <Container maxW="7xl">
            <Flex gap={{ base: '5', lg: '8' }} align={{ base: 'start', lg: 'center' }} direction={{ base: 'column', lg: 'row' }}>
              <Text id="proof-title" fontSize="sm" color="deep.muted" maxW={{ lg: '28ch' }} flexShrink="0">
                Usefulness kept, against the challenge's own baseline. Self-assessed with its pets-eval toolkit.
              </Text>
              <SimpleGrid as="dl" columns={{ base: 2, md: 4 }} gap="6" flex="1" w="full">
                {PROOF.map((item) => (
                  <Box key={item.id}>
                    <Text as="dt" fontFamily="mono" fontSize="xs" color="deep.muted">{item.id}</Text>
                    <Text as="dd" m="0" mt="1" fontFamily="mono" fontSize={{ base: '2xl', md: '3xl' }} fontWeight="medium" letterSpacing="-0.02em" color="forest.300" lineHeight="1.1">
                      {item.ours.toFixed(2)}
                      <Text as="span" fontSize="sm" color="deep.muted" letterSpacing="0" ms="2">vs {item.baseline.toFixed(2)}</Text>
                    </Text>
                    {item.note && <Text as="dd" m="0" fontSize="xs" color="deep.muted">{item.note}</Text>}
                  </Box>
                ))}
              </SimpleGrid>
            </Flex>
          </Container>
        </Box>

        <Box as="section" id="how" aria-labelledby="how-title" py={{ base: '14', md: '20' }} scrollMarginTop="16">
          <Container maxW="7xl">
            <SectionHead id="how-title" kicker="How it works" title="Removing names is rarely enough"
              lead="Age, postcode and a visit date look harmless. Together they single people out. The gate measures that risk on your data, protects each column the way it needs, and stops before the data loses what it was shared for." />
            <SimpleGrid as="ol" listStyleType="none" columns={{ base: 1, sm: 2, lg: 3 }} gap="4" className="stagger">
              {STAGES.map((stage, index) => {
                const StageIcon = stage.icon
                return (
                  <Stack as="li" key={stage.name} gap="3" p="5" rounded="l3" borderWidth="1px" borderColor="border" bg="bg.panel" colorPalette={stage.palette}
                    transition="transform 200ms var(--chakra-easings-out), border-color 200ms" _hover={{ transform: 'translateY(-2px)', borderColor: 'colorPalette.solid' }}>
                    <HStack justify="space-between">
                      <Circle size="10" bg="colorPalette.subtle" color="colorPalette.fg"><StageIcon size={18} aria-hidden="true" /></Circle>
                      <Text fontFamily="mono" fontSize="sm" color="fg.subtle">{String(index + 1).padStart(2, '0')}</Text>
                    </HStack>
                    <Heading as="h3" fontSize="lg">{stage.name}</Heading>
                    <Text fontSize="sm" color="fg.muted">{stage.text}</Text>
                  </Stack>
                )
              })}
            </SimpleGrid>
          </Container>
        </Box>

        <Box as="section" id="results" aria-labelledby="results-title" py={{ base: '14', md: '20' }} bg="bg.panel" borderTopWidth="1px" borderBottomWidth="1px" borderColor="border" scrollMarginTop="16">
          <Container maxW="7xl">
            <SectionHead id="results-title" kicker="Results" title="Protection set by who receives the data"
              lead="The same engine, five recipients. Each scenario carries its own limits and questions, and the gate checks the release against them. These are self-assessed scores, not official judging scores." />
            <Table.ScrollArea borderWidth="1px" borderColor="border" rounded="l3" bg="bg.raised">
              <Table.Root size="md">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>Scenario</Table.ColumnHeader>
                    <Table.ColumnHeader>Recipient</Table.ColumnHeader>
                    <Table.ColumnHeader>Gate</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Privacy</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Usefulness</Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">Rows kept</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {RESULTS.map((row) => {
                    const trust = trustWord(row.trust)
                    const TrustIcon = trust.icon
                    return (
                      <Table.Row key={row.id}>
                        <Table.Cell fontFamily="mono" fontWeight="semibold" whiteSpace="nowrap">{row.id}</Table.Cell>
                        <Table.Cell minW="52">
                          <Stack gap="1.5">
                            <Text>{row.recipient}</Text>
                            <Badge colorPalette={trust.palette} variant="subtle" size="sm" alignSelf="start"><TrustIcon size={12} aria-hidden="true" />{trust.label}</Badge>
                          </Stack>
                        </Table.Cell>
                        <Table.Cell minW="52">
                          <HStack gap="2" align="start" color={row.status === 'release' ? 'brand.fg' : 'orange.fg'}>
                            <Box pt="0.5" flexShrink="0">{row.status === 'release' ? <CircleCheck size={15} aria-hidden="true" /> : <CircleAlert size={15} aria-hidden="true" />}</Box>
                            <Text color="fg">{row.gate}</Text>
                          </HStack>
                        </Table.Cell>
                        <Table.Cell textAlign="end" fontFamily="mono">{row.privacy}</Table.Cell>
                        <Table.Cell textAlign="end" fontFamily="mono">{row.usefulness}</Table.Cell>
                        <Table.Cell textAlign="end" fontFamily="mono" whiteSpace="nowrap">{row.rows}</Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Container>
        </Box>

        <Box as="section" id="risks" aria-labelledby="risks-title" py={{ base: '14', md: '20' }} scrollMarginTop="16">
          <Container maxW="7xl">
            <SectionHead id="risks-title" kicker="Honest limits" title="Risks that remain"
              lead="The gate reports what it couldn't rule out, so the person releasing the data decides with the full picture." />
            <SimpleGrid columns={{ base: 1, md: 2 }} gap="4">
              {RISKS.map((risk) => (
                <HStack key={risk.title} gap="4" align="start" p="5" rounded="l3" borderWidth="1px" borderColor="accent.border" bg="accent.subtle">
                  <Circle size="9" bg="accent.solid" color="accent.contrast" flexShrink="0"><CircleAlert size={17} aria-hidden="true" /></Circle>
                  <Stack gap="1">
                    <Heading as="h3" fontSize="md">{risk.title}</Heading>
                    <Text fontSize="sm" color="fg">{risk.text}</Text>
                  </Stack>
                </HStack>
              ))}
            </SimpleGrid>
          </Container>
        </Box>

        <Box as="section" aria-labelledby="cta-title" bg="deep" color="deep.fg" py={{ base: '14', md: '20' }}>
          <Container maxW="7xl">
            <Stack gap="5" align={{ base: 'start', md: 'center' }} textAlign={{ base: 'start', md: 'center' }}>
              <Heading as="h2" id="cta-title" color="white" fontSize={{ base: '3xl', md: '4xl' }} fontWeight="bold" letterSpacing="display" maxW="22ch">
                See it decide on real attacks, not promises
              </Heading>
              <Text color="deep.muted" maxW="60ch">Every challenge dataset is synthetic and describes fictional people. Pick one, name a recipient, and watch the gate release, hold or block it.</Text>
              <HStack gap="3" flexWrap="wrap" justify={{ md: 'center' }}>
                <Button asChild size="lg" colorPalette="accent"><Link to={SAMPLE_LINK}>Try the healthcare sample<ArrowRight aria-hidden="true" /></Link></Button>
                <Button asChild size="lg" {...ON_DEEP_OUTLINE}><Link to={Path.Runs}>See earlier runs</Link></Button>
              </HStack>
            </Stack>
          </Container>
        </Box>
      </Box>

      <Box as="footer" bg="deep" color="deep.muted" borderTopWidth="1px" borderColor="deep.line" py="8">
        <Container maxW="7xl">
          <Stack gap="3" fontSize="sm">
            <Box alignSelf="start"><BrandLogo onDeep /></Box>
            <Text maxW="80ch">
              Built at Since AI Hackathon 2026 for the TrustED PETs Transformer challenge. Every dataset used is synthetic and comes from the challenge
              package. This project isn't produced or endorsed by the TrustED consortium or the EU.
            </Text>
            <HStack gap="2">
              <BookOpen size={14} aria-hidden="true" />
              <Box asChild color="forest.300" textDecoration="underline" _hover={{ color: 'white' }}><a href={`${API_URL}/api/docs/`}>API documentation</a></Box>
            </HStack>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

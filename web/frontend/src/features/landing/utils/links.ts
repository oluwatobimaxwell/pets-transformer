import { Path } from '@/router/paths'

/** The landing page's main action: the studio with the healthcare sample registered straight away. */
export const SAMPLE_LINK = `${Path.ReleaseData}?sample=health`

export const SECTION_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#results', label: 'Results' },
  { href: '#risks', label: 'Risks that remain' },
]

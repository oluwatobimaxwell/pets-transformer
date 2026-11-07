import { HStack, Stack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Path } from '@/router/paths'
import { SITE } from '@/shared/utils/site-config'
import { BrandMark } from './brand-mark'

interface BrandLogoProps {
  /** On the deep surfaces (rail, landing header) the words switch to the light deep tokens. */
  onDeep?: boolean
}

/**
 * App mark and name, linking to the landing page.
 */
export function BrandLogo({ onDeep = false }: BrandLogoProps) {
  return (
    <HStack asChild gap="2.5" color={onDeep ? 'deep.fg' : 'fg'} rounded="l2"
      _hover={{ '& .brand-name': { color: onDeep ? 'forest.300' : 'brand.fg' } }}>
      <Link to={Path.Home} aria-label={`${SITE.name} home`}>
        <BrandMark />
        <Stack gap="0" lineHeight="1.15">
          <Text className="brand-name" fontWeight="bold" letterSpacing="-0.02em" whiteSpace="nowrap" transition="color 180ms">
            {SITE.name}
          </Text>
          <Text textStyle="xs" color={onDeep ? 'deep.muted' : 'fg.muted'} hideBelow="sm">
            {SITE.tagline}
          </Text>
        </Stack>
      </Link>
    </HStack>
  )
}

import { HStack, Stack, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { Path } from '@/router/paths'
import { SITE } from '@/shared/utils/site-config'
import { BrandMark } from './brand-mark'

/**
 * App mark and name, linking home.
 */
export function BrandLogo() {
  return (
    <HStack asChild gap="2.5" color="fg" rounded="l2" _hover={{ '& .brand-name': { color: 'brand.fg' } }}>
      <Link to={Path.Home} aria-label={`${SITE.name}, start a new release`}>
        <BrandMark />
        <Stack gap="0" lineHeight="1.15">
          <Text className="brand-name" fontWeight="semibold" whiteSpace="nowrap" transition="color 180ms">
            {SITE.name}
          </Text>
          <Text textStyle="xs" color="fg.muted" hideBelow="sm">
            {SITE.tagline}
          </Text>
        </Stack>
      </Link>
    </HStack>
  )
}

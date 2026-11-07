import { Center, type CenterProps } from '@chakra-ui/react'
import { ShieldCheck } from 'lucide-react'

/**
 * The PETs Transformer mark: a checked shield on the ink accent, the same shape as the favicon.
 */
export function BrandMark(props: CenterProps) {
  return (
    <Center boxSize="8" rounded="l2" bg="brand.solid" color="brand.contrast" flexShrink="0" aria-hidden="true" {...props}>
      <ShieldCheck size={18} strokeWidth={2.25} />
    </Center>
  )
}

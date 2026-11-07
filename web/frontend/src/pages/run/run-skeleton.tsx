import { Skeleton, Stack } from '@chakra-ui/react'

/** The run page's shape while the run loads. */
export function RunSkeleton() {
  return (
    <Stack gap="6" aria-busy="true" aria-label="Loading the run">
      <Skeleton h="4" w="32" rounded="l1" />
      <Skeleton h="10" w="96" rounded="l2" />
      <Skeleton h="28" rounded="l3" />
      <Skeleton h="48" rounded="l3" />
    </Stack>
  )
}

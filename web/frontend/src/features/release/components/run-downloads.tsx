import { Button, HStack } from '@chakra-ui/react'
import { dashboardUrl, downloadUrl } from '../utils/run-links'

interface RunDownloadsProps {
  runId: string
  hasRelease: boolean
}

/** Only the release and the evidence can leave the machine. Row maps and keys are never offered. */
export function RunDownloads({ runId, hasRelease }: RunDownloadsProps) {
  return (
    <HStack gap="3" flexWrap="wrap">
      <Button asChild>
        <a href={dashboardUrl(runId)} target="_blank" rel="noreferrer">Open the dashboard</a>
      </Button>
      {hasRelease && (
        <Button asChild variant="outline">
          <a href={downloadUrl(runId, 'release')}>Download protected data</a>
        </Button>
      )}
      <Button asChild variant="outline">
        <a href={downloadUrl(runId, 'evidence')}>Download evidence</a>
      </Button>
    </HStack>
  )
}

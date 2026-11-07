import { Button, HStack } from '@chakra-ui/react'
import { Download, ExternalLink, FileArchive } from 'lucide-react'
import { dashboardUrl, downloadUrl } from '../utils/run-links'

interface RunDownloadsProps {
  runId: string
  hasRelease: boolean
}

/** Only the release and the evidence can leave the machine. Row maps and keys are never offered. */
export function RunDownloads({ runId, hasRelease }: RunDownloadsProps) {
  return (
    <HStack gap="2" flexWrap="wrap">
      <Button asChild>
        <a href={dashboardUrl(runId)} target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" />
          Open the dashboard
        </a>
      </Button>
      {hasRelease && (
        <Button asChild variant="outline">
          <a href={downloadUrl(runId, 'release')}>
            <Download aria-hidden="true" />
            Download protected data
          </a>
        </Button>
      )}
      <Button asChild variant="outline">
        <a href={downloadUrl(runId, 'evidence')}>
          <FileArchive aria-hidden="true" />
          Download evidence
        </a>
      </Button>
    </HStack>
  )
}

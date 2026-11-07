import { Button, HStack } from '@chakra-ui/react'
import { Download, FileArchive } from 'lucide-react'
import { downloadUrl } from '../utils/run-links'

interface RunDownloadsProps {
  runId: string
  hasRelease: boolean
}

/** Only the release and the evidence can leave the machine. Row maps and keys are never offered. */
export function RunDownloads({ runId, hasRelease }: RunDownloadsProps) {
  return (
    <HStack gap="2" flexWrap="wrap">
      <Button asChild variant="outline">
        <a href={downloadUrl(runId, 'evidence')}>
          <FileArchive aria-hidden="true" />
          Evidence
        </a>
      </Button>
      {hasRelease && (
        <Button asChild>
          <a href={downloadUrl(runId, 'release')}>
            <Download aria-hidden="true" />
            Download protected data
          </a>
        </Button>
      )}
    </HStack>
  )
}

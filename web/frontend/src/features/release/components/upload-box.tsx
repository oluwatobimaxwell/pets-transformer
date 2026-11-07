import { useRef, useState } from 'react'
import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react'

interface UploadBoxProps {
  onUpload: (files: File[]) => void
  disabled: boolean
}

/** Pick one or more CSV files. Each file becomes one table. */
export function UploadBox({ onUpload, disabled }: UploadBoxProps) {
  const input = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  return (
    <Box borderWidth="1px" borderStyle="dashed" borderColor="border.emphasized" rounded="l3" p="6">
      <Stack gap="3">
        <Text color="fg.muted">Each CSV file becomes one table. Files that share a column, such as a customer ID, are treated as linked.</Text>
        <input
          ref={input}
          type="file"
          accept=".csv,text/csv"
          multiple
          hidden
          aria-label="Choose CSV files"
          onChange={(event) => setFiles(Array.from(event.currentTarget.files ?? []))}
        />
        <HStack gap="3" flexWrap="wrap">
          <Button variant="outline" onClick={() => input.current?.click()} disabled={disabled}>
            Choose CSV files
          </Button>
          <Button onClick={() => onUpload(files)} disabled={disabled || files.length === 0} loading={disabled}>
            Upload {files.length > 0 ? `${files.length} ${files.length === 1 ? 'file' : 'files'}` : ''}
          </Button>
        </HStack>
        {files.length > 0 && <Text textStyle="sm" fontFamily="mono">{files.map((file) => file.name).join(', ')}</Text>}
      </Stack>
    </Box>
  )
}

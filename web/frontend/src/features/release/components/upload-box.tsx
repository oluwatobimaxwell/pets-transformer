import { useRef, useState, type DragEvent } from 'react'
import { Box, Button, Circle, HStack, Stack, Tag, Text } from '@chakra-ui/react'
import { FileSpreadsheet, FolderOpen, Upload, UploadCloud } from 'lucide-react'
import { isCsv } from '../utils/is-csv'

interface UploadBoxProps {
  onUpload: (files: File[]) => void
  disabled: boolean
}

/** Pick or drop one or more CSV files. Each file becomes one table. */
export function UploadBox({ onUpload, disabled }: UploadBoxProps) {
  const input = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const drop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    if (!disabled) setFiles(Array.from(event.dataTransfer.files).filter(isCsv))
  }
  return (
    <Box borderWidth="1.5px" borderStyle="dashed" rounded="l3" p={{ base: "5", md: "6" }}
      borderColor={dragging ? 'brand.solid' : 'border.emphasized'} bg={dragging ? 'brand.subtle' : 'bg.panel'}
      transition="background 180ms, border-color 180ms"
      onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={drop}>
      <Stack gap="4" h="full" justify="center">
        <Circle size="11" bg="brand.subtle" color="brand.fg">
          <UploadCloud size={20} aria-hidden="true" />
        </Circle>
        <Stack gap="1">
          <Text fontWeight="semibold">Drop CSV files here</Text>
          <Text textStyle="sm" color="fg.muted">
            Each CSV file becomes one table. Files that share a column, such as a customer ID, are treated as linked.
          </Text>
        </Stack>
        <input ref={input} type="file" accept=".csv,text/csv" multiple hidden aria-label="Choose CSV files"
          onChange={(event) => setFiles(Array.from(event.currentTarget.files ?? []))} />
        {files.length > 0 && (
          <HStack gap="1.5" flexWrap="wrap" aria-label="Chosen files">
            {files.map((file) => (
              <Tag.Root key={file.name} size="sm" variant="outline">
                <Tag.StartElement><FileSpreadsheet aria-hidden="true" /></Tag.StartElement>
                <Tag.Label fontFamily="mono">{file.name}</Tag.Label>
              </Tag.Root>
            ))}
          </HStack>
        )}
        <HStack gap="2" flexWrap="wrap">
          <Button variant="outline" size="sm" onClick={() => input.current?.click()} disabled={disabled}>
            <FolderOpen aria-hidden="true" />
            Choose CSV files
          </Button>
          <Button size="sm" onClick={() => onUpload(files)} disabled={disabled || files.length === 0} loading={disabled}>
            <Upload aria-hidden="true" />
            Upload {files.length > 0 ? `${files.length} ${files.length === 1 ? 'file' : 'files'}` : ''}
          </Button>
        </HStack>
      </Stack>
    </Box>
  )
}

import { useRef, useState, type DragEvent } from 'react'
import { Box, Button, Circle, HStack, IconButton, Stack, Text } from '@chakra-ui/react'
import { FileSpreadsheet, Upload, UploadCloud, X } from 'lucide-react'
import { formatBytes } from '../utils/format-bytes'
import { isCsv } from '../utils/is-csv'

interface UploadBoxProps {
  onUpload: (files: File[]) => void
  disabled: boolean
}

/** Drop or browse for CSV files, check the list, then upload. Each file becomes one table. */
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
    <Stack gap="4">
      <Box asChild w="full" borderWidth="1.5px" borderStyle="dashed" rounded="l3" py={{ base: '8', md: '10' }} px="6"
        borderColor={dragging ? 'brand.solid' : 'border.emphasized'} bg={dragging ? 'brand.subtle' : 'bg.panel'} cursor="pointer"
        transition="background 180ms, border-color 180ms" _hover={{ borderColor: 'brand.solid' }}>
        <button type="button" disabled={disabled} onClick={() => input.current?.click()}
          onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={drop}>
          <Stack gap="3" align="center" textAlign="center">
            <Circle size="12" bg="brand.subtle" color="brand.fg"><UploadCloud size={22} aria-hidden="true" /></Circle>
            <Text fontWeight="semibold">Drag CSV files here, or <Text as="span" color="brand.fg" textDecoration="underline">browse</Text></Text>
            <Text textStyle="sm" color="fg.muted">CSV only. One file per table; upload related files together.</Text>
          </Stack>
        </button>
      </Box>
      <input ref={input} type="file" accept=".csv,text/csv" multiple hidden aria-label="Choose CSV files"
        onChange={(event) => setFiles(Array.from(event.currentTarget.files ?? []))} />
      {files.length > 0 && (
        <Stack as="ul" listStyleType="none" gap="0" aria-label="Chosen files" borderWidth="1px" borderColor="border" rounded="l3" bg="bg.panel" divideY="1px" divideColor="border">
          {files.map((file) => (
            <HStack as="li" key={file.name} gap="3" px="4" py="2.5">
              <FileSpreadsheet size={17} aria-hidden="true" style={{ flexShrink: 0 }} />
              <Text fontFamily="mono" textStyle="sm" flex="1" truncate>{file.name}</Text>
              <Text textStyle="sm" color="fg.muted" fontFamily="mono">{formatBytes(file.size)}</Text>
              <IconButton size="xs" variant="ghost" aria-label={`Remove ${file.name}`} disabled={disabled}
                onClick={() => setFiles((current) => current.filter((item) => item !== file))}>
                <X />
              </IconButton>
            </HStack>
          ))}
        </Stack>
      )}
      <HStack justify="space-between" gap="3" flexWrap="wrap">
        <Text textStyle="sm" color="fg.muted">{files.length ? `${files.length} ${files.length === 1 ? 'file' : 'files'} ready` : 'No files chosen yet'}</Text>
        <Button onClick={() => onUpload(files)} disabled={disabled || files.length === 0} loading={disabled}>
          <Upload aria-hidden="true" />
          Upload {files.length > 0 ? `${files.length} ${files.length === 1 ? 'file' : 'files'}` : ''}
        </Button>
      </HStack>
    </Stack>
  )
}

import { Box, Button, CloseButton, Drawer, Portal, Stack, Text } from '@chakra-ui/react'
import { ShieldCheck } from 'lucide-react'
import { DATA_HANDLING } from '../utils/data-handling'

/** Opens a drawer saying where the data lives, what the API serves and what never leaves this machine. */
export function DataHandlingButton() {
  return (
    <Drawer.Root size="sm">
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="sm">
          <ShieldCheck aria-hidden="true" />
          <Text as="span" hideBelow="md">Data handling</Text>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>How your data is handled</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Stack as="dl" gap="4">
                {DATA_HANDLING.map((item) => (
                  <Box key={item.term}>
                    <Text as="dt" fontWeight="semibold">{item.term}</Text>
                    <Text as="dd" color="fg.muted" textStyle="sm" mt="0.5">{item.text}</Text>
                  </Box>
                ))}
              </Stack>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" aria-label="Close" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

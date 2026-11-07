import { IconButton, type IconButtonProps } from '@chakra-ui/react'
import { Moon, Sun } from 'lucide-react'
import { useColorMode } from '@/shared/hooks/use-color-mode'

/** Switches light and dark. Style props let it sit on the deep surfaces too. */
export function ColorModeButton(props: Omit<IconButtonProps, 'aria-label' | 'onClick'>) {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <IconButton
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      variant="ghost"
      size="sm"
      color="fg.muted"
      onClick={toggleColorMode}
      {...props}
    >
      {isDark ? <Sun /> : <Moon />}
    </IconButton>
  )
}

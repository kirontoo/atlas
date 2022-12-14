import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, useColorMode } from '@chakra-ui/react';

export default function DarkModeToggle(props: ButtonProps) {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button
      aria-label="Toggle Color Mode"
      onClick={toggleColorMode}
      _focus={{ boxShadow: 'none' }}
      variant="ghost"
      w="fit-content"
      {...props}
    >
      {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

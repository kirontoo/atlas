import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';

const styles = {
  global: (props: Dict<any>) => ({
    body: {
      fontFamily: 'body',
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.50', 'gray.800')(props),
      lineHeight: 'base',
    },
    '*::placeholder': {
      color: mode('gray.400', 'whiteAlpha.400')(props),
    },
    '*, *::before, &::after': {
      borderColor: mode('gray.200', 'whiteAlpha.300')(props),
      wordWrap: 'break-word',
    },
  }),
};

const theme = extendTheme(
  {
    styles,
    colors: {
      primary: {
        main: baseTheme.colors.purple[400],
        ...baseTheme.colors.purple,
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: 'primary',
  }),
);

import { mode } from '@chakra-ui/theme-tools';
import { Dict } from '@chakra-ui/utils';

export default theme;

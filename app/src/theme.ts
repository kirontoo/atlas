import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';

const theme = extendTheme(
  {
    colors: {
      primary: baseTheme.colors.purple,
    },
  },
  withDefaultColorScheme({
    colorScheme: 'primary',
  }),
);

export default theme;

import {
  extendTheme,
  theme as baseTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';

const theme = extendTheme(
  {
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

export default theme;

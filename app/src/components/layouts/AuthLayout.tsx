import { Flex, Show, Stack, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';
interface IAuthLayout {
  main: ReactNode;
  aside?: ReactNode;
  children?: ReactNode;
  reverse?: Boolean;
}

function AuthLayout({ main, aside, reverse }: IAuthLayout) {
  return (
    <Stack
      maxH={'100vh'}
      minH={'100vh'}
      direction={{ base: 'column', md: reverse ? 'row-reverse' : 'row' }}
      spacing={0}
    >
      <Flex
        p={8}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.900')}
        w={{ base: 'full', md: '60%' }}
      >
        {main}
      </Flex>
      {aside ? (
        <Show above="md">
          <Flex flex={1} maxH={'100vh'}>
            {aside}
          </Flex>
        </Show>
      ) : null}
    </Stack>
  );
}

export default AuthLayout;

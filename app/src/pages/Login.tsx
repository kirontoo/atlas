import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChangeEvent, useState } from 'react';

import AuthLayout from '../components/layouts/AuthLayout';

function LoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    let val = e.target.value;
    if (e.type == 'email') {
      setEmail(() => val);
    } else {
      setPassword(() => val);
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={{ base: 'center', md: 'start' }}>
          <Heading fontSize={'4xl'} color={'primary.400'}>
            Login to your account
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={onInputChange} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={onInputChange} />
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: 'column', sm: 'row' }}
                align={'start'}
                justify={'space-between'}
              >
                <Checkbox>Remember me</Checkbox>
                <Link color={'blue.400'}>Forgot password?</Link>
              </Stack>
              <Button>Login</Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

function Aside() {
  return (
    <Container
      h={'100%'}
      minW={'full'}
      padding={0}
      paddingBottom="24"
      bg={useColorModeValue('gray.50', 'gray.900')}
    >
      <Box
        h="full"
        w="full"
        bgGradient={useColorModeValue(
          'linear(to-r, background, primary.400)',
          'linear(to-r, background, primary.400)',
        )}
        borderBottomRightRadius="3xl"
      ></Box>
    </Container>
  );
}

function Login() {
  return <AuthLayout main={<LoginCard />} aside={<Aside />} reverse />;
}

export default Login;

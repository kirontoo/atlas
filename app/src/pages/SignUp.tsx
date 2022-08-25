import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';

import AuthLayout from '../components/layouts/AuthLayout';

function SignUpCard() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Stack spacing={8} w={'full'} mx={'auto'} maxW={'lg'} py={12} px={{ base: 0, md: 6 }}>
      <Stack align={'left'}>
        <Heading fontSize={'4xl'} textAlign={'left'} color={'primary.300'}>
          Sign up
        </Heading>
        <Text fontSize={'lg'} color={useColorModeValue('gray.400', 'white')}>
          to enjoy all of our cool features ✌️
        </Text>
      </Stack>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('gray.50', 'gray.800')}
        boxShadow={'lg'}
        p={8}
      >
        <Stack spacing={4}>
          <HStack>
            <Box>
              <FormControl id="firstName" isRequired>
                <FormLabel>First Name</FormLabel>
                <Input type="text" />
              </FormControl>
            </Box>
            <Box>
              <FormControl id="lastName">
                <FormLabel>Last Name</FormLabel>
                <Input type="text" />
              </FormControl>
            </Box>
          </HStack>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input type="email" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? 'text' : 'password'} />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={() => setShowPassword((showPassword) => !showPassword)}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={10} pt={2}>
            <Button loadingText="Submitting" size="lg">
              Sign up
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={'center'}>
              Already a user? <Link color={'primary.300'}>Sign In</Link>
            </Text>
          </Stack>
          <Stack direction="row" justify="center">
            <Button variant="outline">Demo as Admin</Button>
            <Button variant="outline">Demo as User</Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
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
          'linear(to-l, background, primary.400)',
          'linear(to-l, background, primary.400)',
        )}
        borderBottomLeftRadius="3xl"
      ></Box>
    </Container>
  );
}

function SignUp() {
  return <AuthLayout main={<SignUpCard />} aside={<Aside />} />;
}

export default SignUp;

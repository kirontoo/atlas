import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FirebaseError } from '@firebase/util';
import {
  browserLocalPersistence,
  inMemoryPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { ChangeEvent, useState } from 'react';
import { FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { auth } from '../auth/firebase';
import AuthLayout from '../components/layouts/AuthLayout';
import { UserActions } from '../store/features/user/userSlice';

function LoginCard() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const storeDispatch = useDispatch();

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    if (id == 'email') {
      setEmail(() => value);
    } else {
      setPassword(() => value);
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : inMemoryPersistence,
      );
      const user = await signInWithEmailAndPassword(auth, email, password);
      storeDispatch({ type: UserActions.LOGIN, payload: user });
      navigate('/dashboard');
    } catch (e: unknown) {
      if (e instanceof FirebaseError) {
        const { code } = e;
        switch (code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            setError('wrong email or password');
            break;
          default:
            setError('something went wrong, try again later');
            break;
        }
      }
    }
  }

  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={{ base: 'center', md: 'start' }}>
          <Heading fontSize={'4xl'} color={'primary.400'}>
            Login to your account
          </Heading>
          <Text fontSize={'lg'} color={useColorModeValue('gray.400', 'white')}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8}
          as="form"
          onSubmit={onSubmit}
        >
          <Stack spacing={4}>
            <FormControl id="email" isInvalid={error !== null} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={onInputChange} />
            </FormControl>
            <FormControl id="password" isInvalid={error !== null} isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={onInputChange} />
              {error != '' && <FormErrorMessage>{error !== null}</FormErrorMessage>}
            </FormControl>
            <Stack
              direction={{ base: 'column', sm: 'row' }}
              align={'start'}
              justify={'space-between'}
            >
              <Checkbox
                isChecked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                Remember me
              </Checkbox>
              <Link color={'primary.300'}>Forgot password?</Link>
            </Stack>
            <Button type="submit">Login</Button>
            <Text align={'center'}>
              No account?{' '}
              <Link color={'primary.300'} href="/signup">
                Sign up
              </Link>
            </Text>
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
        bg={useColorModeValue(
          'radial-gradient(circle at top left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%), radial-gradient(circle at top right ,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom right,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%),radial-gradient(circle, transparent 25%, background  26%),linear-gradient(45deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%), linear-gradient(135deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%)',
          'radial-gradient(circle at top left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%), radial-gradient(circle at top right ,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom right,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%),radial-gradient(circle, transparent 25%, background  26%),linear-gradient(45deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%), linear-gradient(135deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%)',
        )}
        bgSize="10em 10em"
        opacity={1}
        borderBottomRightRadius="3xl"
      ></Box>
    </Container>
  );
}

function Login() {
  return <AuthLayout main={<LoginCard />} aside={<Aside />} reverse />;
}

export default Login;

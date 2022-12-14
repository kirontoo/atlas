import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
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
import { FirebaseError } from '@firebase/util';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { useReducer, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { auth } from '../auth/firebase';
import AuthLayout from '../components/layouts/AuthLayout';
import { UserActions } from '../store/features/user/userSlice';

function SignUpCard() {
  interface ISignupUser {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
  }

  const initState: ISignupUser = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
  };

  const InputActions = {
    email: 'email',
    firstName: 'firstName',
    lastName: 'lastName',
    password: 'password',
    username: 'username',
    reset: 'reset',
  };

  const storeDispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [state, inputDispatch] = useReducer(inputReducer, initState);
  const [errors, setErrors] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    username: '',
  });
  const navigate = useNavigate();

  function inputReducer(state: ISignupUser, action: { type: string; payload: string }) {
    switch (action.type) {
      case InputActions.firstName:
        return { ...state, firstName: action.payload };
      case InputActions.lastName:
        return { ...state, lastName: action.payload };
      case InputActions.username:
        return { ...state, username: action.payload };
      case InputActions.email:
        return { ...state, email: action.payload };
      case InputActions.password:
        return { ...state, password: action.payload };
      case InputActions.reset:
        return initState;
      default:
        return state;
    }
  }

  function onTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id: type, value: payload } = e.target;
    inputDispatch({ type, payload });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      // clear old errors before attempting to sign up user
      setErrors({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        username: '',
      });

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        state.email,
        state.password,
      );
      const { user } = userCredential;
      storeDispatch({ type: UserActions.LOGIN, payload: user });
      inputDispatch({ type: InputActions.reset, payload: '' });
      navigate('/dashboard/');
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        const errorMessage = error.message;
        switch (errorCode) {
          case 'auth/invalid-email':
            setErrors((state) => ({ ...state, email: 'invalid email' }));
            break;
          case 'auth/email-already-in-use':
            setErrors((state) => ({ ...state, email: 'email is already in use' }));
            break;
          case 'auth/weak-password':
            setErrors((state) => ({ ...state, password: errorMessage }));
            break;
          default:
            // TODO: handle this with a error message for the user
            console.log(errorMessage);
            break;
        }
      }

      // TODO: add a default error message (catch all)
    }
  }

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
        as="form"
        onSubmit={onSubmit}
      >
        <Stack spacing={4}>
          <HStack>
            <Box>
              <FormControl id={InputActions.firstName} isInvalid={errors.firstName != ''}>
                <FormLabel>First Name</FormLabel>
                <Input type="text" value={state.firstName} onChange={onTextChange} />
                {errors.firstName != '' && (
                  <FormErrorMessage>{errors.firstName}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box>
              <FormControl id={InputActions.lastName} isInvalid={errors.lastName != ''}>
                <FormLabel>Last Name</FormLabel>
                <Input type="text" value={state.lastName} onChange={onTextChange} />
                {errors.lastName != '' && (
                  <FormErrorMessage>{errors.lastName}</FormErrorMessage>
                )}
              </FormControl>
            </Box>
          </HStack>
          <FormControl
            id={InputActions.username}
            isRequired
            isInvalid={errors.username != ''}
          >
            <FormLabel>Username</FormLabel>
            <Input type="text" value={state.username} onChange={onTextChange} />
            {errors.username != '' && (
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id={InputActions.email} isRequired isInvalid={errors.email != ''}>
            <FormLabel>Email address</FormLabel>
            <Input type="email" value={state.email} onChange={onTextChange} />
            {errors.email != '' && <FormErrorMessage>{errors.email}</FormErrorMessage>}
          </FormControl>
          <FormControl
            id={InputActions.password}
            isRequired
            isInvalid={errors.password != ''}
          >
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={state.password}
                onChange={onTextChange}
              />
              <InputRightElement h={'full'}>
                <Button
                  variant={'ghost'}
                  onClick={() => setShowPassword((showPassword) => !showPassword)}
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {errors.password != '' && (
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            )}
          </FormControl>
          <Stack spacing={10} pt={2}>
            <Button loadingText="Submitting" size="lg" type="submit">
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
        bg={useColorModeValue(
          'radial-gradient(circle at top left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%), radial-gradient(circle at top right ,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom right,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%),radial-gradient(circle, transparent 25%, background  26%),linear-gradient(45deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%), linear-gradient(135deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%)',
          'radial-gradient(circle at top left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom left,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%), radial-gradient(circle at top right ,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%) , radial-gradient(circle at bottom right,transparent 9%, #9F7AEA 10% ,#9F7AEA 15% , transparent 16%),radial-gradient(circle, transparent 25%, background  26%),linear-gradient(45deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%), linear-gradient(135deg, transparent 46%, #9F7AEA 47%, #9F7AEA 52%, transparent 53%)',
        )}
        bgSize="10em 10em"
        opacity={1}
        borderBottomLeftRadius="3xl"
      ></Box>
    </Container>
  );
}

function SignUp() {
  return <AuthLayout main={<SignUpCard />} aside={<Aside />} />;
}

export default SignUp;

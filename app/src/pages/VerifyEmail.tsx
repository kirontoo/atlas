import {
  Button,
  Center,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { sendEmailVerification, User } from 'firebase/auth';
import { useSelector } from 'react-redux';

import { selectUser } from '../store/features/user/userSlice';

export default function VerifyEmail() {
  const user: User | null = useSelector(selectUser);

  async function sendVerificationEmail() {
    if (user) {
      await sendEmailVerification(user, null);
    }
  }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Stack
        spacing={4}
        w={'full'}
        maxW={'sm'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={10}
      >
        <Center>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
            Verify your Email
          </Heading>
        </Center>
        <Center
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}
        >
          <VStack>
            <Text>We have sent a verification link to your email:</Text>
            <Text fontWeight="bold">{user?.email ?? 'user@mail.com'}</Text>
            <Text>If you have not received an link</Text>
          </VStack>
        </Center>
        <Button onClick={sendVerificationEmail}>Click here to resend</Button>
      </Stack>
    </Flex>
  );
}

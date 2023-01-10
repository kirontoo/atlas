import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FormEvent, useRef, useState } from 'react';

import { sendPasswordResetLink } from '../utils/services/AuthService';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);

  async function sendPasswordResetRequest(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      if (email != '') {
        await sendPasswordResetLink(email);
        onOpen();
      }
    } catch (e: unknown) {
      setError('could not send reset password email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
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
              Forgot your password?
            </Heading>
          </Center>
          <VStack
            fontSize={{ base: 'sm', sm: 'md' }}
            color={useColorModeValue('gray.800', 'gray.400')}
            display="flex"
            flexDirection="column"
            as="form"
            onSubmit={sendPasswordResetRequest}
            gap="1rem"
          >
            <FormControl id="email" isInvalid={error !== ''} isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              {error != '' && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
            <Button width="full" type="submit" isLoading={isLoading}>
              Send Reset Password Email
            </Button>
          </VStack>
        </Stack>
      </Flex>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Reset Password</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            An reset password link has been sent to your email! Please click on the link
            to reset your password.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Ok
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

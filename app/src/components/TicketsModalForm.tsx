import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Select,
  Text,
  Textarea,
  UseDisclosureProps,
  VStack,
} from '@chakra-ui/react';

interface TicketsModalFormProps extends UseDisclosureProps {
  blockScrollOnMount?: boolean;
}

function TicketsModalForm({
  isOpen,
  onClose,
  blockScrollOnMount,
}: TicketsModalFormProps) {
  return (
    <>
      <Modal
        blockScrollOnMount={blockScrollOnMount}
        isOpen={isOpen ?? false}
        onClose={onClose!}
        size="3xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create A New Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              as="form"
              spacing={6}
              alignItems="start"
            >
              <VStack w="full">
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" />
                  <FormHelperText>ticket name</FormHelperText>
                </FormControl>
                <FormControl>
                  <FormLabel>Project</FormLabel>
                  <Select placeholder="Select project">
                    <option value="project1">Project 1</option>
                    <option value="project2">Project 2</option>
                    <option value="project3">Project 3</option>
                  </Select>
                  <FormHelperText>assign ticket to a project</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea size="md" rows={4} />
                  <FormHelperText>short description describing the ticket</FormHelperText>
                </FormControl>
              </VStack>
              <VStack w="full">
                <FormControl>
                  <FormLabel>Assign Ticket</FormLabel>
                  <Select>
                    <option value="user1">user 1</option>
                    <option value="user2">user 2</option>
                    <option value="user3">user 3</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>
                    Due Date
                    <Text as="span" color="red">
                      !
                    </Text>
                  </FormLabel>
                  <Input type="date" />
                </FormControl>
              </VStack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost">cancel</Button>
            <Button mr={3} onClick={onClose}>
              Create Ticket
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TicketsModalForm;

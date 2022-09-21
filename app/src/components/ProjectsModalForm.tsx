import {
  Avatar,
  AvatarGroup,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Highlight,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  Textarea,
  UseDisclosureProps,
  VStack,
} from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa';

interface ProjectsModalFormProps extends UseDisclosureProps {
  blockScrollOnMount?: boolean;
}

function ProjectsModalForm({
  isOpen,
  onClose,
  blockScrollOnMount,
}: ProjectsModalFormProps) {
  function onSubmit() {
    onClose!();
  }

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
          <ModalHeader>
            <Highlight
              query="Project"
              styles={{ px: '2', py: '1', rounded: 'md', bg: 'primary.100' }}
            >
              Create A New Project
            </Highlight>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              as="form"
              spacing={6}
              alignItems="start"
            >
              <VStack w="full" spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input type="text" />
                  <FormHelperText>project name</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea size="md" rows={4} />
                  <FormHelperText>
                    short description describing the project
                  </FormHelperText>
                </FormControl>
                <FormControl>
                  <Menu isLazy>
                    <MenuButton as={Button} rightIcon={<FaChevronDown />}>
                      Add Project Members
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        as="div"
                        closeOnSelect={false}
                        isFocusable
                        _hover={{ background: 'inherit' }}
                      >
                        <Input type="text" placeholder="Search for user..." focus />
                      </MenuItem>
                      <MenuDivider />
                      <MenuItem>
                        <HStack>
                          <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                          <Text>Kent Dodds</Text>
                        </HStack>
                      </MenuItem>
                      <MenuItem>
                        <HStack>
                          <Avatar
                            name="Ryan Florence"
                            src="https://bit.ly/ryan-florence"
                          />
                          <Text>Ryan Florence</Text>
                        </HStack>
                      </MenuItem>
                      <MenuItem>
                        <HStack>
                          <Avatar
                            name="Christian Nwamba"
                            src="https://bit.ly/code-beast"
                          />
                          <Text>Christian Nwamba</Text>
                        </HStack>
                      </MenuItem>
                      <MenuItem>
                        <HStack>
                          <Avatar
                            name="Christian Nwamba"
                            src="https://bit.ly/code-beast"
                          />
                          <Text>Christian Nwamba</Text>
                        </HStack>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </FormControl>
              </VStack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              cancel
            </Button>
            <Button mr={3} onClick={onSubmit}>
              Create Project
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProjectsModalForm;

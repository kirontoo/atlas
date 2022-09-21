import { Avatar, AvatarGroup, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import {
  Box,
  Center,
  Heading,
  Icon,
  Image,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';

import ProjectCard from '../../components/ProjectCard';
import ProjectsModalForm from '../../components/ProjectsModalForm';

function Projects() {
  const { isOpen, onOpen: onOpenModal, onClose } = useDisclosure();
  return (
    <>
      <Grid templateColumns="repeat(6, minmax(200px, 1fr)" gap={4} gridAutoFlow="dense">
        <GridItem
          colSpan={6}
          bg={useColorModeValue('white', 'gray.700')}
          borderRadius="lg"
          p="4"
          shadow="md"
          display="flex"
          gap="4"
        >
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />

          <Box
            maxW={'400px'}
            w={'full'}
            rounded={'md'}
            p={6}
            overflow={'hidden'}
            as="button"
            border="1px solid"
            borderColor="gray.400"
            _hover={{
              background: useColorModeValue('blackAlpha.300', 'whiteAlpha.100'),
            }}
            _active={{
              background: useColorModeValue('blackAlpha.400', 'whiteAlpha.400'),
            }}
            onClick={onOpenModal}
          >
            <VStack>
              <Icon as={FaPlus} color="gray.500" />
              <Text fontWeight="bold" color="gray.500">
                Create a New Project
              </Text>
            </VStack>
          </Box>
        </GridItem>

        <GridItem
          colSpan={4}
          bg={useColorModeValue('white', 'gray.700')}
          borderRadius="lg"
          p="4"
          shadow="md"
        >
          <TableContainer>
            <Table variant="unstyled">
              <Thead>
                <Tr>
                  <Th>Projects</Th>
                  <Th>Members</Th>
                  <Th isNumeric>tickets</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Atlas</Td>
                  <Td>
                    <AvatarGroup size="sm" max={4}>
                      <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                      <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                      <Avatar
                        name="Prosper Otemuyiwa"
                        src="https://bit.ly/prosper-baba"
                      />
                      <Avatar
                        name="Prosper Otemuyiwa"
                        src="https://bit.ly/prosper-baba"
                      />
                      <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                    </AvatarGroup>
                  </Td>
                  <Td>23</Td>
                  <Td>Edit</Td>
                </Tr>
                <Tr>
                  <Td>rxkiro</Td>
                  <Td>
                    <AvatarGroup size="sm" max={4}>
                      <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                      <Avatar
                        name="Prosper Otemuyiwa"
                        src="https://bit.ly/prosper-baba"
                      />
                      <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                    </AvatarGroup>
                  </Td>
                  <Td>4</Td>
                  <Td>Edit</Td>
                </Tr>
                <Tr>
                  <Td>notWoS</Td>
                  <Td>
                    <AvatarGroup size="sm" max={4}>
                      <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
                      <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                      <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                      <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
                      <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
                      <Avatar
                        name="Prosper Otemuyiwa"
                        src="https://bit.ly/prosper-baba"
                      />
                      <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
                    </AvatarGroup>
                  </Td>
                  <Td>14</Td>
                  <Td>Edit</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>

        <GridItem
          colSpan={2}
          bg={useColorModeValue('white', 'gray.700')}
          borderRadius="lg"
        ></GridItem>
      </Grid>
      <ProjectsModalForm isOpen={isOpen} onClose={onClose} blockScrollOnMount={true} />
    </>
  );
}

export default Projects;

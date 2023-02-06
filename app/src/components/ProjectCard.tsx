import { useColorModeValue } from '@chakra-ui/react';
import { Box, Button, Heading, Image, Stack, Text } from '@chakra-ui/react';
import { Link as ReactLink } from 'react-router-dom';

import { UUID } from '../types';
import { dashboardProjectsRoute } from '../utils/routes';

interface ProjectCardProps {
  name: string;
  description: string;
  id: UUID;
}

function ProjectCard({ name, description, id }: ProjectCardProps) {
  return (
    <Box
      maxW={'450px'}
      minW={{ base: '18rem', md: 'inherit' }}
      w={'full'}
      p={6}
      overflow={'hidden'}
    >
      <Box
        h={'240px'}
        bg={'gray.100'}
        rounded={'md'}
        overflow={'hidden'}
        mt={-6}
        mx={-6}
        mb={6}
        pos={'relative'}
      >
        <Image
          src={
            'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
          }
        />
      </Box>
      <Stack spacing="4">
        <Heading
          color={useColorModeValue('gray.700', 'white')}
          fontSize={'xl'}
          fontFamily={'body'}
        >
          {name}
        </Heading>
        <Text color={'gray.500'} fontSize="sm">
          {description}
        </Text>
        <Button
          size="sm"
          variant="outline"
          textTransform="uppercase"
          w="fit-content"
          as={ReactLink}
          to={`${dashboardProjectsRoute}/${id}`}
        >
          View Project
        </Button>
      </Stack>
    </Box>
  );
}

export default ProjectCard;

import { Button, Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectProjectById } from '../../store/features/projects';
import { RootState } from '../../store/reducer';

function ProjectId() {
  let { id } = useParams();
  const project = useSelector((state: RootState) => {
    return selectProjectById(state, id ?? '');
  });

  return (
    <Stack>
      {project !== undefined ? (
        <>
          <HStack justify={'space-between'}>
            <Heading as="h1">{project.name}</Heading>
            <Button>Edit Project</Button>
          </HStack>

          <Stack>
            <Heading as="h4" size="sm">
              Description
            </Heading>
            <Text>{project.description}</Text>
          </Stack>
          <Stack>
            <Heading as="h4" size="sm">
              Created By
            </Heading>
            <Text>
              {project.createdBy.firstName} {project.createdBy.lastName}
            </Text>
          </Stack>
          <hr />
        </>
      ) : (
        <div>
          <p>cannot find project</p>
          {project}
        </div>
      )}
    </Stack>
  );
}

export default ProjectId;

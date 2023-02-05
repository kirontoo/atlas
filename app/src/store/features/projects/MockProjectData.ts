import { faker } from '@faker-js/faker';

import type { Project } from '../../../types';
import { RepoType } from '../../../types';
import { AdminUser } from '../user/MockUserData';

function generateProject(): Project {
  return {
    ownerId: AdminUser.id,
    id: faker.database.mongodbObjectId(),
    name: `${faker.word.adjective()} ${faker.word.noun()}`,
    description: faker.lorem.paragraph(),
    createdBy: AdminUser,
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    teamMembers: [],
    deadline: faker.date.future().toISOString(),
    repo: {
      type: RepoType.Github,
      src: 'https://github.com/kirontoo/atlas',
    },
  };
}

const Projects: Project[] = new Array(3).fill(null).map(() => generateProject());

export { generateProject, Projects };

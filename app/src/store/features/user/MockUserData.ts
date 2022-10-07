import { faker } from '@faker-js/faker';

import type { User } from '../../../types';
import { Role } from '../../../types';

const AdminUser: User = {
  id: faker.database.mongodbObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: 'admin_user',
  email: 'admin@user.com',
  role: Role.Admin,
  avatar: {
    src: faker.image.avatar(),
    width: 640,
    height: 480,
  },
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
};

const MemberUser: User = {
  id: faker.database.mongodbObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: 'member_user',
  email: 'member@user.com',
  role: Role.Member,
  avatar: {
    src: faker.image.avatar(),
    height: 480,
    width: 640,
  },
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
};

const OwnerUser: User = {
  id: faker.database.mongodbObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: 'owner_user',
  email: 'owner@user.com',
  role: Role.Owner,
  avatar: {
    src: faker.image.avatar(),
    width: 640,
    height: 480,
  },
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
};

const Users: User[] = new Array(8).map(() => {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  return {
    id: faker.database.mongodbObjectId(),
    firstName,
    lastName,
    username: faker.internet.userName(),
    email: faker.internet.email(firstName, lastName),
    role: Role.Member,
    avatar: {
      src: faker.internet.avatar(),
      width: 640,
      height: 480,
    },
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
});

export { AdminUser, MemberUser, OwnerUser, Users };

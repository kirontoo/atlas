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
};

const MemberUser: User = {
  id: faker.database.mongodbObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: 'member_user',
  email: 'member@user.com',
  role: Role.Member,
};

const OwnerUser: User = {
  id: faker.database.mongodbObjectId(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  username: 'owner_user',
  email: 'owner@user.com',
  role: Role.Owner,
};

export { AdminUser, MemberUser, OwnerUser };

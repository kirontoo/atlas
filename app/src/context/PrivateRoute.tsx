import { createContext } from 'react';

enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
  ProjectLead = 'PROJECT_LEAD',
  Owner = 'OWNER',
}

export type UserCredentials = {
  name: string;
  token: string;
  expiresAt: string;
  role: UserRole;
};

const defaultValue: UserCredentials = {
  name: '',
  token: '',
  expiresAt: '',
  role: UserRole.User,
};

const AuthContext = createContext(defaultValue);

export { AuthContext, UserRole };

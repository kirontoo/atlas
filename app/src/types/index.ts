enum Role {
  Admin,
  Member,
  Owner,
}

enum RepoType {
  Github = 'Github',
  Gitlab = 'Gitlab',
}

type UUID = string;

interface User {
  id: UUID;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: Role;
  avatar: {
    src: string;
    height: number;
    width: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: UUID;
  tags: string[];
  name: string;
  assignedUsers: UUID[]; // user ids
  description: string;
  dueDate: string | null;
  createdBy: UUID;
  createdAt: string;
  updatedAt: string;
}

interface Organization {
  id: UUID;
  name: string;
  ownerId: UUID;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  ownerId: string;
  id: UUID;
  name: string;
  description: string;
  createdBy: UUID;
  createdAt: string;
  updatedAt: string;
  teamMembers: UUID[]; // user ids
  repo: Repo;
}

interface Repo {
  type: RepoType;
  src: string;
}

export type { Organization, Project, Repo, Ticket, User, UUID };
export { RepoType, Role };

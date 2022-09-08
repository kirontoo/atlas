enum Role {
  Admin,
  Member,
  Owner,
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: Role;
}

interface Ticket {
  id: string;
  tags: string[];
  title: string;
  assigned: string[]; // user ids
}

interface Organization {
  id: string;
  name: string;
}

interface Project {
  ownerId: string;
  id: string;
  name: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type { Organization, Project, Ticket, User };
export { Role };

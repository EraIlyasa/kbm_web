import { Role } from '../constants/Roles.js';

export interface User {
  email: string;
  password?: string;
  role: Role;
  firstName?: string;
  lastName?: string;
}

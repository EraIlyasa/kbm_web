export const Roles = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
  MANAGER: 'MANAGER',
  GUEST: 'GUEST',
} as const;

export type Role = typeof Roles[keyof typeof Roles];

import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'role-protected';

export const RoleProtected = (...args: string[]) =>
  SetMetadata(META_ROLES, args);

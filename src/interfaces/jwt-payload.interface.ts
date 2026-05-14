import { Role } from '../modules/auth/role.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
}

import { ObjectType } from '@nestjs/graphql';
import { Role } from '../entities/role.entity';

@ObjectType()
// export class RoleWithoutUser extends OmitType(Role, ['users'], ObjectType) {}
export class RoleWithoutUser extends Role {}

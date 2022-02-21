import { ObjectType, OmitType } from '@nestjs/graphql';
import { Role } from '../entities/role.entity';

@ObjectType()
export class RoleWithoutUser extends OmitType(Role, ['user'], ObjectType) {}

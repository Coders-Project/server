import { ObjectType, OmitType } from '@nestjs/graphql';
import { Profile } from '../entites/profile.entity';

@ObjectType()
export class ProfileWithoutUser extends OmitType(
  Profile,
  ['user'],
  ObjectType,
) {}

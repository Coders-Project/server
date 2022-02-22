import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { Profile } from '../../profile/entites/profile.entity';
import { User } from '../entities/user.entity';

@InputType()
class SubUpdateUserInput extends PartialType(
  OmitType(User, ['createdAt', 'id', 'role', 'profile'], InputType),
) {}

@InputType()
class SubUpdateProfileInput extends PartialType(
  OmitType(Profile, ['id', 'user'], InputType),
) {}

@InputType()
export class UpdateUserInput {
  @Field(() => SubUpdateUserInput, { nullable: true })
  user: SubUpdateUserInput;
  @Field(() => SubUpdateProfileInput, { nullable: true })
  profile: SubUpdateProfileInput;
}

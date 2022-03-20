import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class FollowMutationOutput {
  @Field(() => User)
  follower: User;

  @Field(() => User)
  following: User;
}

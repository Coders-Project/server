import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class FollowOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [User])
  list: User[];
}

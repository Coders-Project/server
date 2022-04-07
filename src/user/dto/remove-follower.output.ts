import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RemoveFollowerOutput {
  @Field(() => Int)
  userId: number;
}

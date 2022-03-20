import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindAllPostInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  take?: number;
}

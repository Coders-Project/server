import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindAllPostOptions {
  @Field(() => Int, { nullable: true })
  page?: number;
}
@InputType()
export class FindAllPostInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => FindAllPostOptions, { nullable: true })
  options?: FindAllPostOptions;
}

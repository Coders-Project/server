import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FindAllPostOptions {
  @Field(() => Boolean, { nullable: true })
  onlyWithMedia?: boolean;
  // @Field(() => Int, { nullable: true })
  // only?: number;
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

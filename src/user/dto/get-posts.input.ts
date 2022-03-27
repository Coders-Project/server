import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class GetPostsOptions {
  @Field(() => Boolean, { nullable: true })
  onlyWithMedia?: boolean;
  // @Field(() => Int, { nullable: true })
  // only?: number;
}

@InputType()
export class GetPostsInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => GetPostsOptions, { nullable: true })
  options?: GetPostsOptions;
}

import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class FeedOptions {
  @Field(() => Boolean, { nullable: true })
  excludeFollowing?: boolean;
}

@InputType()
export class FeedInput {
  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  take?: number;

  @Field(() => FeedOptions, { nullable: true })
  options?: FeedOptions;
}

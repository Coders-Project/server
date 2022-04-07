import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostPaginationOuput {
  @Field(() => Int)
  total: number;

  @Field(() => [Post])
  list: Post[];
}

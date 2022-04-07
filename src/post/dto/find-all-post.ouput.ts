import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';
import { PostWithoutUser } from './post-without-user';

@ObjectType()
export class FindAllPostOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [Post])
  list: PostWithoutUser[];
}

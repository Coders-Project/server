import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostWithoutUser } from '../../post/dto/post-without-user';
import { Post } from '../../post/entities/post.entity';

@ObjectType()
export class GetPostsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [Post])
  list: PostWithoutUser[];
}

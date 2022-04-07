import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@InputType()
export class CreatePostInput extends PickType(
  Post,
  // ['body', 'raw', 'postParentId', 'isFollowOnly'],
  ['draftRaw', 'isFollowOnly'],
  InputType,
) {
  @Field(() => Int, { nullable: true })
  postParentId?: number;
}

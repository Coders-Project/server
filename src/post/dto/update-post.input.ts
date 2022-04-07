import { Field, InputType, Int, PickType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@InputType()
export class MediasInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  path: number;
}
@InputType()
export class UpdatePostInput extends PickType(
  Post,
  // ['body', 'raw', 'postParentId', 'isFollowOnly'],
  ['id', 'draftRaw', 'isFollowOnly'],
  InputType,
) {
  @Field(() => [Int], { nullable: true })
  mediasRemovedIds?: number[];
}

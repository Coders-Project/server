import { InputType, PickType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@InputType()
export class CreatePostInput extends PickType(
  Post,
  // ['body', 'raw', 'postParentId', 'isFollowOnly'],
  ['draftRaw', 'postParentId', 'isFollowOnly'],
  InputType,
) {
  // @Field(() => Int)
  // exampleField: number;
}

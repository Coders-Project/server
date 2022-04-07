import { CreatePostMentionInput } from './create-post-mention.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostMentionInput extends PartialType(CreatePostMentionInput) {
  @Field(() => Int)
  id: number;
}

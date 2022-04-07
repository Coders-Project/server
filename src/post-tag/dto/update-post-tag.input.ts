import { CreatePostTagInput } from './create-post-tag.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostTagInput extends PartialType(CreatePostTagInput) {
  @Field(() => Int)
  id: number;
}

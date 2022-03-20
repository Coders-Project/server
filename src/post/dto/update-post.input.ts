import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput, InputType) {
  @Field(() => Int)
  id: number;
}

import { CreatePostMediaInput } from './create-post-media.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePostMediaInput extends PartialType(CreatePostMediaInput) {
  @Field(() => Int)
  id: number;
}

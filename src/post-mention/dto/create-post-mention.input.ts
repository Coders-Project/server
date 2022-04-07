import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostMentionInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

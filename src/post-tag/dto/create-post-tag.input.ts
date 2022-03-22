import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostTagInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

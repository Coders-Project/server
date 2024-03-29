import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePostMediaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}

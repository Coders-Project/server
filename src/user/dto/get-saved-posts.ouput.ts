import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostSave } from '../../post-save/entities/post-save.entity';

@ObjectType()
export class GetSavedPostsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [PostSave])
  list: PostSave[];
}

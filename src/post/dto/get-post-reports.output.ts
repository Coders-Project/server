import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostReport } from '../../post-report/entity/post-report.entity';

@ObjectType()
export class GetPostReportsOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [PostReport])
  list: PostReport[];
}

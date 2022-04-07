import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PostReport } from '../entity/post-report.entity';

@ObjectType()
export class FindAllPostReportOutput {
  @Field(() => [PostReport], { nullable: true })
  list: PostReport[];

  @Field(() => Int, { nullable: true })
  total: number;
}

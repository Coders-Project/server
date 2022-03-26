import { Field, InputType, PickType } from '@nestjs/graphql';
import { PostReport } from '../entity/post-report.entity';

@InputType()
export class PostReportInput extends PickType(
  PostReport,
  ['reason'],
  InputType,
) {
  @Field()
  postId: number;
}

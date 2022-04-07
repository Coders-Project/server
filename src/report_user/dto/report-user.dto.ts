import { InputType, PickType } from '@nestjs/graphql';
import { ReportUserEntity } from '../entities/report-user.entity';

@InputType()
export class ReportUserInput extends PickType(
  ReportUserEntity,
  ['userReportedId', 'reason'],
  InputType,
) {}

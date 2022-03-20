import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ReportUserInput } from './dto/report-user.dto';
import { ReportUserEntity } from './entities/report-user.entity';
import { UserReportService } from './report-user.service';

// TODO : Crée un pubsub global et l'injecter dans les contructors

@Resolver(() => ReportUserEntity)
export class ReportUserResolver {
  constructor(private readonly userReportService: UserReportService) {}

  @Mutation(() => Boolean, { name: 'reportUser' })
  async report(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      type: () => ReportUserInput,
    })
    input: ReportUserInput,
  ) {
    await this.userReportService.report(input.userReportedId, input.reason);
    return true;
  }
}

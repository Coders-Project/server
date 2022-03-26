import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserRoles } from 'src/role/dto/role.enum';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { Roles } from '../auth/dto/roles.decorator';
import { User } from '../user/entities/user.entity';
import { FindAllPostReportInput } from './dto/find-all-post-report.input';
import { FindAllPostReportOutput } from './dto/find-all-post-report.output';
import { PostReportInput } from './dto/report-post.input';
import { PostReport } from './entity/post-report.entity';
import { PostReportService } from './post-report.service';

@Resolver()
export class PostReportResolver {
  constructor(private readonly postReportService: PostReportService) {}

  @Roles(UserRoles.Admin)
  @Query(() => FindAllPostReportOutput, { name: 'postReport' })
  async getPostReport(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      nullable: true,
      type: () => FindAllPostReportInput,
    })
    input?: FindAllPostReportInput,
  ) {
    const _input = input || ({} as FindAllPostReportInput);
    return this.postReportService.findAll(_input);
  }

  @Mutation(() => PostReport, { name: 'reportPost' })
  async reportPost(
    @CurrentUser() user: User,
    @Args({
      name: 'input',
      type: () => PostReportInput,
    })
    input: PostReportInput,
  ) {
    return this.postReportService.report(user, input);
  }
}

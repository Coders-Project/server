import { InjectPubSub } from '@nestjs-query/query-graphql';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { Public } from '../auth/dto/public.decorator';
import { Roles } from '../auth/dto/roles.decorator';
import { UserRoles } from '../role/dto/role.enum';
import { User } from '../user/entities/user.entity';
import { FindAllPostReportInput } from './dto/find-all-post-report.input';
import { FindAllPostReportOutput } from './dto/find-all-post-report.output';
import { PostReportInput } from './dto/report-post.input';
import { PostReport } from './entity/post-report.entity';
import { PostReportService } from './post-report.service';

const REPORT_POST_SUBSCRIPTION = 'reportPost';
@Resolver()
export class PostReportResolver {
  constructor(
    @InjectPubSub() private readonly pubSub: PubSub,
    private readonly postReportService: PostReportService,
  ) {}

  @Public()
  @Subscription(() => PostReport, {
    name: REPORT_POST_SUBSCRIPTION,
    resolve: (value) => value.payload,
  })
  subscribeToFollow() {
    return this.pubSub.asyncIterator(REPORT_POST_SUBSCRIPTION);
  }

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
    const report = await this.postReportService.report(user, input);
    this.pubSub.publish(REPORT_POST_SUBSCRIPTION, { payload: report });
    return report;
  }
}

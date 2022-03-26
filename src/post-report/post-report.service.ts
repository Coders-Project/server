import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { User } from '../user/entities/user.entity';
import { FindAllPostReportInput } from './dto/find-all-post-report.input';
import { PostReportInput } from './dto/report-post.input';
import { PostReport } from './entity/post-report.entity';

@Injectable()
export class PostReportService {
  constructor(
    private readonly postService: PostService,
    @InjectRepository(PostReport)
    private readonly postReportRepository: Repository<PostReport>,
  ) {}
  /**
   *
   * @param user
   * @param input
   * @returns
   */
  async report(user: User, input: PostReportInput) {
    const post = await this.postService.findOne(input.postId);
    const reportPost = new PostReport();
    reportPost.reason = input.reason;
    reportPost.user = user;
    reportPost.post = post;

    await reportPost.save();
    await reportPost.reload();

    return reportPost;
  }
  /**
   *
   * @param input
   * @returns
   */
  async findAll(input?: FindAllPostReportInput) {
    const _take = input.take || 10;
    const _page = input.page ? input.page * _take : 0;

    const result = await this.postReportRepository.findAndCount({
      take: _take,
      skip: _page,
      relations: ['post', 'user'],
    });

    console.log(result);

    return {
      total: result[1],
      list: result[0],
    };
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { PostReport } from './entity/post-report.entity';
import { PostReportResolver } from './post-report.resolver';
import { PostReportService } from './post-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostReport]), PostModule, UserModule],
  providers: [PostReportResolver, PostReportService],
})
export class PostReportModule {}

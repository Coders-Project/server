import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { PostReport } from '../post-report/entity/post-report.entity';
import { UserModule } from '../user/user.module';
import { Post } from './entities/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMedia, PostReport]),
    AuthModule,
    UserModule,
  ],
  providers: [PostResolver, PostService],
  exports: [PostService],
})
export class PostModule {}

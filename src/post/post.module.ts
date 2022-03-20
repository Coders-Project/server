import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { Post } from './entities/post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post, PostMedia])],
  providers: [PostResolver, PostService],
})
export class PostModule {}

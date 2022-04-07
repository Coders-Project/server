import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostReply } from './entities/post-reply.entity';
import { PostReplyResolver } from './post-reply.resolver';
import { PostReplyService } from './post-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostReply])],
  providers: [PostReplyResolver, PostReplyService],
})
export class PostReplyModule {}

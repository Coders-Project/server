import { Module } from '@nestjs/common';
import { PostMentionService } from './post-mention.service';
import { PostMentionResolver } from './post-mention.resolver';

@Module({
  providers: [PostMentionResolver, PostMentionService]
})
export class PostMentionModule {}

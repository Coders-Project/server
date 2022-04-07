import { Module } from '@nestjs/common';
import { PostTagService } from './post-tag.service';
import { PostTagResolver } from './post-tag.resolver';

@Module({
  providers: [PostTagResolver, PostTagService]
})
export class PostTagModule {}

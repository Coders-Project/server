import { Module } from '@nestjs/common';
import { PostMediaService } from './post-media.service';
import { PostMediaResolver } from './post-media.resolver';

@Module({
  providers: [PostMediaResolver, PostMediaService]
})
export class PostMediaModule {}

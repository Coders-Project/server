import { Resolver } from '@nestjs/graphql';
import { PostReplyService } from './post-reply.service';

@Resolver()
export class PostReplyResolver {
  constructor(private readonly postReplyService: PostReplyService) {}
}

import { Test, TestingModule } from '@nestjs/testing';
import { PostReplyResolver } from './post-reply.resolver';
import { PostReplyService } from './post-reply.service';

describe('PostReplyResolver', () => {
  let resolver: PostReplyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostReplyResolver, PostReplyService],
    }).compile();

    resolver = module.get<PostReplyResolver>(PostReplyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

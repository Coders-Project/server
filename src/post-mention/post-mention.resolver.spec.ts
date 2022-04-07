import { Test, TestingModule } from '@nestjs/testing';
import { PostMentionResolver } from './post-mention.resolver';
import { PostMentionService } from './post-mention.service';

describe('PostMentionResolver', () => {
  let resolver: PostMentionResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostMentionResolver, PostMentionService],
    }).compile();

    resolver = module.get<PostMentionResolver>(PostMentionResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

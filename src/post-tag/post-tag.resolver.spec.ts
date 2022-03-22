import { Test, TestingModule } from '@nestjs/testing';
import { PostTagResolver } from './post-tag.resolver';
import { PostTagService } from './post-tag.service';

describe('PostTagResolver', () => {
  let resolver: PostTagResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostTagResolver, PostTagService],
    }).compile();

    resolver = module.get<PostTagResolver>(PostTagResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

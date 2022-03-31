import { Test, TestingModule } from '@nestjs/testing';
import { PostSaveResolver } from './post-save.resolver';
import { PostSaveService } from './post-save.service';

describe('PostSaveResolver', () => {
  let resolver: PostSaveResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostSaveResolver, PostSaveService],
    }).compile();

    resolver = module.get<PostSaveResolver>(PostSaveResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

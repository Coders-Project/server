import { Test, TestingModule } from '@nestjs/testing';
import { PostMentionService } from './post-mention.service';

describe('PostMentionService', () => {
  let service: PostMentionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostMentionService],
    }).compile();

    service = module.get<PostMentionService>(PostMentionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { PostReplyService } from './post-reply.service';

describe('PostReplyService', () => {
  let service: PostReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostReplyService],
    }).compile();

    service = module.get<PostReplyService>(PostReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

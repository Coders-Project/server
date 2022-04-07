import { Test, TestingModule } from '@nestjs/testing';
import { PostSaveService } from './post-save.service';

describe('PostSaveService', () => {
  let service: PostSaveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostSaveService],
    }).compile();

    service = module.get<PostSaveService>(PostSaveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

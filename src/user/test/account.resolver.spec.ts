import { Test, TestingModule } from '@nestjs/testing';
import { userResolver } from '../user.resolver';
import { UserService } from '../user.service';

describe('userResolver', () => {
  let resolver: userResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [userResolver, UserService],
    }).compile();

    resolver = module.get<userResolver>(userResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

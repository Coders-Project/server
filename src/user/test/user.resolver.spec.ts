import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../profile/entites/profile.entity';
import { User } from '../entities/user.entity';
import { userResolver } from '../user.resolver';
import { UserService } from '../user.service';

describe('userResolver', () => {
  let resolver: userResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([User, Profile]),
      ],
      providers: [userResolver, UserService],
      exports: [UserService],
    })
      .overrideProvider('UserRepository')
      .useClass(Repository)
      .overrideProvider('ProfileRepository')
      .useClass(Repository)
      .compile();

    resolver = module.get<userResolver>(userResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('Query -> User', () => {
    expect(resolver).toBeDefined();
  });
});

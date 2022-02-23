import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../profile/entites/profile.entity';
import { User } from '../entities/user.entity';
import { userResolver } from '../user.resolver';
import { UserService } from '../user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([User, Profile]),
        ConfigModule.forRoot(),
      ],
      providers: [userResolver, UserService],
      exports: [UserService],
    })
      .overrideProvider('UserRepository')
      .useClass(Repository)
      .overrideProvider('ProfileRepository')
      .useClass(Repository)
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

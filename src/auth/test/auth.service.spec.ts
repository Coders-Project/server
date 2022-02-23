import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
// import { UserModule } from '../../user.module';
import { UserModule } from '../../user/user.module';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        UserModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: '60s',
          },
        }),
      ],
      providers: [AuthResolver, AuthService, LocalStrategy, JwtStrategy],
    })
      .overrideProvider('UserRepository')
      .useClass(Repository)
      .overrideProvider('ProfileRepository')
      .useClass(Repository)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

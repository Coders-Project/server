import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { JwtPayload } from '../../../dist/auth/dto/jwt-payload';
import { User } from '../../user/entities/user.entity';
import { UserModule } from '../../user/user.module';
import { UserService } from '../../user/user.service';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { IS_PUBLIC_KEY } from '../dto/public.decorator';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        PassportModule,
        UserModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn: process.env.JWT_EXPIRATION,
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

    authResolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(authResolver).toBeDefined();
  });

  it('login() must be @Public()', () => {
    const publicMetadata = Reflect.getMetadata(
      IS_PUBLIC_KEY,
      authResolver.login,
    );

    expect(publicMetadata).toBe(true);
    // tester si la metadonnée @Public() est appliquée
    // tester si elle return un user avec les valeurs données en input
    // tester si elle return l'access token avec le user
  });

  it('when rememberMe() is called', async () => {
    const jwtPayload: JwtPayload = {
      userID: 999,
    };

    const token = jwtService.sign(jwtPayload);

    const contextMock = {
      req: {
        headers: {
          authorization: token,
        },
      },
    };

    const userMock: Partial<User> = {
      id: jwtPayload.userID,
    };

    userService.findOne = jest.fn().mockReturnValue(userMock);

    const result = await authResolver.rememberMe(contextMock);

    expect(result).toStrictEqual({
      user: { ...userMock },
      accessToken: token,
    });
    // authService.decodeJwt = jest.fn().mockReturnValue();
    // tester si en passant un token valide elle return un user avec l'id qui est dans le payload
    // tester si en passant un token invalide elle renvoie une erreur
  });
});

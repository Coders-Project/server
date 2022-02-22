import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { BaseContext } from 'apollo-server-types';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './dto/current-user.decorator';
import { LoginInput } from './dto/login.input';
import { LoginOutput } from './dto/login.output';
import { Public } from './dto/public.decorator';
// import { Auth } from './entities/auth.entity';
import { GqlAuthGuard } from './guards/local.guard';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @UseGuards(GqlAuthGuard)
  @Query(() => LoginOutput)
  async login(
    @Args('input') input: LoginInput,
    @CurrentUser() user: User,
  ): Promise<LoginOutput> {
    const token = this.authService.login(user);
    return { user, ...token };
  }

  @Query(() => LoginOutput)
  async rememberMe(@Context() ctx: BaseContext): Promise<LoginOutput> {
    const token = ctx.req.headers.authorization;
    const tokenDecode = this.authService.decodeJwt(token);

    if (!tokenDecode) {
      throw new NotFoundException();
    }

    const userFind = await this.userService.findOne(tokenDecode.userID);

    const newToken = this.authService.login(userFind);

    return {
      user: userFind,
      ...newToken,
    };
  }
}

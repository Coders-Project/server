import { NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../user/dto/create-user.input';
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
    return { user, ...this.authService.login(user) };
  }

  @Public()
  @Mutation(() => LoginOutput)
  async createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<LoginOutput> {
    const userCreate = await this.userService.create(input);
    const token = this.authService.login(userCreate);
    return { user: userCreate, accessToken: token.accessToken };
  }

  @Query(() => LoginOutput)
  async rememberMe(@CurrentUser() user: User): Promise<LoginOutput> {
    const userFind = await this.userService.findOne(user.id);

    if (!userFind) {
      throw new NotFoundException();
    }

    const newToken = this.authService.login(userFind);

    return {
      user: userFind,
      ...newToken,
    };
  }
}

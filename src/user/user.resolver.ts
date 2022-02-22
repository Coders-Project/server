import { UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { Roles } from '../auth/dto/roles.decorator';
import { RolesGuard } from '../auth/guards/role.guard';
import { ProfileWithoutUser } from '../profile/dto/profile-without-user.input';
import { Profile } from '../profile/entites/profile.entity';
import { RoleWithoutUser } from '../role/dto/role-without-user';
import { UserRoles } from '../role/dto/role.enum';
import { Role } from '../role/entities/role.entity';
import { JwtAuthGard } from './../auth/guards/jwt.guard';
import { CreateUserInput } from './dto/create-user.input';
import { FindAllUserInput } from './dto/findall-user.input';
import { FindAllUserOutput } from './dto/findall-user.output';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class userResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }

  // @UseGuards(JwtAuthGard)
  // ! Mettre un guard
  @Query(() => FindAllUserOutput, { name: 'users' })
  async findAll(
    @Args('input', { nullable: true }) input?: FindAllUserInput,
  ): Promise<FindAllUserOutput> {
    return this.userService.findAll(input?.take, input?.page);
  }

  @Roles(UserRoles.Moderator)
  // @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGard, RolesGuard)
  @Query(() => User, { name: 'user' })
  findById(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGard)
  @Query(() => User, { name: 'me' })
  getSelf(@CurrentUser() user: User) {
    return this.userService.findOne(user.id);
  }

  @UseGuards(JwtAuthGard)
  @Mutation(() => User)
  updateUser(
    @CurrentUser() user: User,
    @Args('update') updateInput: UpdateUserInput,
  ) {
    return this.userService.update(user.id, updateInput);
  }

  @ResolveField(() => RoleWithoutUser, { name: 'role' })
  getRole(@Parent() user: User): Promise<Role[]> {
    return this.userService.getRole(user.id);
  }

  @ResolveField(() => ProfileWithoutUser, { name: 'profile' })
  getProfile(@Parent() user: User): Promise<Profile> {
    return this.userService.getProfile(user.id);
  }
  // @Mutation(() => User)
  // removeuser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id);
  // }
}

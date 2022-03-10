import {
  InternalServerErrorException,
  PayloadTooLargeException,
  UseGuards,
} from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
// import { LoginOutput } from '../../graphql/mutations/register/register.generated';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { Public } from '../auth/dto/public.decorator';
import { FileHandler } from '../helpers/FileHandler';
import { ProfileWithoutUser } from '../profile/dto/profile-without-user.input';
import { Profile } from '../profile/entites/profile.entity';
import { RoleWithoutUser } from '../role/dto/role-without-user';
import { Role } from '../role/entities/role.entity';
import { JwtAuthGard } from './../auth/guards/jwt.guard';
import { FindAllUserInput } from './dto/findall-user.input';
import { FindAllUserOutput } from './dto/findall-user.output';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class userResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => FindAllUserOutput, { name: 'users' })
  async findAll(
    @Args('input', { nullable: true }) input?: FindAllUserInput,
  ): Promise<FindAllUserOutput> {
    return this.userService.findAll(input?.take, input?.page);
  }

  @Public()
  @Query(() => User, { name: 'user' })
  findByUsername(
    @CurrentUser() user: User,
    @Args('username', { type: () => String }) username: string,
  ): Promise<User> {
    console.log('Current user : ', user);

    return this.userService.findOne({
      where: {
        username: username,
      },
    });
  }

  @UseGuards(JwtAuthGard)
  @Query(() => User, { name: 'me' })
  getSelf(@CurrentUser() user: User) {
    return this.userService.findOne({
      where: {
        id: user.id,
      },
    });
  }

  //! penser a enlever le @Public
  @UseGuards(JwtAuthGard)
  @Mutation(() => User)
  async updateSelf(
    @CurrentUser() user: User,
    @Args('update', { nullable: true }) updateInput: UpdateUserInput,
    @Args({
      name: 'profilePictureFile',
      type: () => GraphQLUpload,
      nullable: true,
    })
    profilePictureFile: FileUpload,
    @Args({
      name: 'backgroundPictureFile',
      type: () => GraphQLUpload,
      nullable: true,
    })
    backgroundPictureFile: FileUpload,
  ) {
    const accept = ['image/jpeg', 'image/png', 'image/webp'];
    try {
      if (profilePictureFile) {
        const result = await FileHandler.upload(
          profilePictureFile,
          String(user.id),
          {
            accept,
          },
        );
        updateInput.profile.profilePicture = result.uploadPath;
      }

      if (backgroundPictureFile) {
        const result = await FileHandler.upload(
          backgroundPictureFile,
          String(user.id),
          {
            accept,
          },
        );
        updateInput.profile.backroundPicture = result.uploadPath;
      }
    } catch (err) {
      console.log(err.name);
      if (err.name === 'PayloadTooLargeError') {
        throw new PayloadTooLargeException({ error: { maxFileSize: true } });
      }
      throw new InternalServerErrorException();
    }

    return this.userService.update(user.id, updateInput);
  }

  @ResolveField(() => [RoleWithoutUser], { name: 'roles' })
  getRole(@Parent() user: User): Promise<Role[]> {
    return this.userService.getRole(user.id);
  }

  @ResolveField(() => ProfileWithoutUser, { name: 'profile' })
  async getProfile(
    @Parent() user: User,
    @Context() ctx: ExpressContext,
  ): Promise<Profile> {
    const profile = await this.userService.getProfile(user.id);

    if (profile.profilePicture) {
      profile.profilePicture = FileHandler.getStaticPath(
        ctx,
        profile.profilePicture,
      );
    }

    if (profile.backroundPicture) {
      profile.backroundPicture = FileHandler.getStaticPath(
        ctx,
        profile.backroundPicture,
      );
    }

    return profile;
  }
  // @Mutation(() => User)
  // removeuser(@Args('id', { type: () => Int }) id: number) {
  //   return this.userService.remove(id);
  // }
}

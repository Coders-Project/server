import {
  Inject,
  InternalServerErrorException,
  PayloadTooLargeException,
  UseGuards
} from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription
} from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
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
import { FollowInput } from './dto/follow.input';
import { FollowMutationOutput } from './dto/follow.mutation.output';
import { FollowOutput } from './dto/follow.output';
import { GetPostsInput } from './dto/get-posts.input';
import { GetPostsOutput } from './dto/get-posts.ouput';
import { GetSavedPostsOutput } from './dto/get-saved-posts.ouput';
import { RemoveFollowerOutput } from './dto/remove-follower.output';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

const FOLLOW_SUBSCRIPTION = 'follow';
@Resolver(() => User)
export class userResolver {
  constructor(
    @Inject('pub_sub') private pubSub: PubSub,
    private readonly userService: UserService,
  ) {}

  @Public()
  @Subscription(() => FollowMutationOutput, {
    name: FOLLOW_SUBSCRIPTION,
    resolve: (value) => value.payload,
  })
  subscribeToFollow() {
    // @Context('PUB_SUB') pubSub: PubSub, // ze
    // return pubSub.asyncIterator('follow');
    return this.pubSub.asyncIterator(FOLLOW_SUBSCRIPTION);
  }
  @Mutation(() => FollowMutationOutput)
  async toggleFollow(
    @CurrentUser() user: User,
    @Args({
      name: 'followingId',
      type: () => Int,
    })
    followingId: number,
  ): Promise<FollowMutationOutput> {
    const { follower, following } = await this.userService.toggleFollow(
      user.id,
      followingId,
    );

    // pubSub.publish('follow', { payload: { follower, following } });
    this.pubSub.publish(FOLLOW_SUBSCRIPTION, {
      payload: { follower, following },
    });

    return { follower, following };
  }

  // @Mutation(() => FollowMutationOutput)
  @Mutation(() => RemoveFollowerOutput)
  async removeFollower(
    @CurrentUser() user: User,
    @Args({
      name: 'followerId',
      type: () => Int,
    })
    followerId: number,
    // ): Promise<FollowMutationOutput> {
  ): Promise<RemoveFollowerOutput> {
    // const { follower, following } = await this.userService.deleteFollower(
    // const _user = await this.userService.deleteFollower(followerId, user.id);
    await this.userService.deleteFollower(followerId, user.id);

    return { userId: followerId };
  }

  @Query(() => Boolean, { name: 'isFollow' })
  async getIsFollow(
    @Parent() user: User,
    @Args('followerId', { type: () => Int }) followerId: number,
    @Args('followingId', { type: () => Int }) followingId: number,
  ): Promise<boolean> {
    const isFollow = await this.userService.isFollow(followerId, followingId);
    return Boolean(isFollow);
  }

  @Query(() => FindAllUserOutput, { name: 'users' })
  async findAll(
    @Args('input', { nullable: true }) input?: FindAllUserInput,
  ): Promise<FindAllUserOutput> {
    return this.userService.findAll(input?.take, input?.page);
  }

  // TODO : Recuperer quand meme l'user meme si fonction est publique
  @Public()
  @Query(() => User, { name: 'user' })
  async findByUsername(
    @CurrentUser() user: User,
    @Args('username', { type: () => String }) username: string,
  ): Promise<User> {
    const userFound = await this.userService.findOne({
      where: {
        username: username,
      },
    });

    return userFound;
  }

  @UseGuards(JwtAuthGard)
  @Query(() => User, { name: 'me' })
  getSelf(@CurrentUser() user: User) {
    return this.userService.findOne({
      where: {
        id: user.id,
      },
      // ! TODO: Attention aux relations
      relations: ['followers', 'followings'],
    });
  }

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

  @ResolveField(() => FollowOutput, { name: 'followers' })
  // async getFollowers(@Parent() user: User): Promise<User['followers']> {
  async getFollowers(
    @Parent() user: User,
    @Args({ name: 'input', type: () => FollowInput, nullable: true })
    input: FollowInput,
  ) {
    const _input = input || {};
    return this.userService.getFollowers(user.id, _input.take, _input.page);
  }

  @ResolveField(() => FollowOutput, { name: 'followings' })
  // async getFollowings(@Parent() user: User): Promise<User['followings']> {
  async getFollowings(
    @Parent() user: User,
    @Args({ name: 'input', type: () => FollowInput, nullable: true })
    input: FollowInput,
  ) {
    const _input = input || {};
    return this.userService.getFollowings(user.id, _input.take, _input.page);
  }

  @ResolveField(() => [RoleWithoutUser], { name: 'roles' })
  getRole(@Parent() user: User): Promise<Role[]> {
    return this.userService.getRole(user.id);
  }

  @ResolveField(() => GetPostsOutput, {
    name: 'posts',
    description: 'Get user post',
  })
  getPosts(
    @Parent() user: User,
    @Args({ name: 'input', type: () => GetPostsInput, nullable: true })
    input: GetPostsInput,
  ): Promise<Role[]> {
    const _input = input || {};
    return this.userService.getPosts(
      user.id,
      _input.take,
      _input.page,
      _input.options,
    );
  }

  @ResolveField(() => GetSavedPostsOutput, {
    name: 'savedPost',
    description: 'Get user post',
  })
  getSavedPost(
    @Parent() user: User,
    @Args({ name: 'input', type: () => GetPostsInput, nullable: true })
    input: GetPostsInput,
  ) {
    const _input = input || {};
    return this.userService.getSavedPost(user, _input.take, _input.page);
  }

  @ResolveField(() => ProfileWithoutUser, {
    name: 'profile',
    description: 'Get user profile',
  })
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

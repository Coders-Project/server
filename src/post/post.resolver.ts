import { BadRequestException } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CurrentUser } from 'src/auth/dto/current-user.decorator';
import { FileHandler } from '../helpers/FileHandler';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  // ! Enlever @Public()
  // @Public()
  @Mutation(() => Post, { name: 'createPost' })
  async create(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) createPostInput: CreatePostInput,
    @Args({
      name: 'medias',
      type: () => [GraphQLUpload],
      nullable: true,
    })
    mediasPendings: FileUpload[],
  ) {
    // On attends que tout les fichiers soit résolu avant de les uploads
    const medias = (await Promise.all(mediasPendings || [])) || [];

    /**
     * On crée le post
     */
    if (medias.length === 0 && !createPostInput.draftRaw) {
      return new BadRequestException('We need at least one media or body');
    }

    const mediasPaths = [];
    for (const media of medias) {
      const file = await FileHandler.upload(media, String(user.id));
      mediasPaths.push(file.uploadPath);
    }

    return this.postService.create(createPostInput, mediasPaths, user);
  }

  @ResolveField(() => [PostMedia], { name: 'medias' })
  async getMedias(
    @Parent() post: Post,
    @Context() ctx: ExpressContext,
  ): Promise<PostMedia[]> {
    const medias = await this.postService.getMedias(post.id);

    medias.forEach((m) => {
      m.path = FileHandler.getStaticPath(ctx, m.path);
    });

    return medias;
  }

  @ResolveField(() => User, { name: 'author' })
  getUser(@Parent() post: Post): Promise<User> {
    console.log(post);
    return this.postService.findPostAuthor(post.id);
  }

  @Query(() => [Post], { name: 'feed' })
  // getFeed(@CurrentUser() user: User): Promise<Post[]> {
  async getFeed(@CurrentUser() user: User) {
    // return this.postService.getFeeds(user.id);
    // return this.postService.getFeeds(user.id);
    return (await this.postService.getFeeds(user.id)).posts;
  }

  // @ResolveField(() => [PostMedia], { name: 'medias' })
  // getRole(@Parent() post: Post): Promise<PostMedia[]> {
  //   return this.postService.getMedias(post.id);
  // }

  @Query(() => [Post], { name: 'post' })
  findAll() {
    return this.postService.findAll();
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postService.findOne(id);
  }

  @Mutation(() => Post)
  updatePost(@Args('updatePostInput') updatePostInput: UpdatePostInput) {
    return this.postService.update(updatePostInput.id, updatePostInput);
  }

  @Mutation(() => Post)
  removePost(@Args('id', { type: () => Int }) id: number) {
    return this.postService.remove(id);
  }
}

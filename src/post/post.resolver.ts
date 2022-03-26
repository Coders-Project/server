import { BadRequestException } from '@nestjs/common';
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
import { CurrentUser } from 'src/auth/dto/current-user.decorator';
import { Public } from 'src/auth/dto/public.decorator';
import { FileHandler } from '../helpers/FileHandler';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostInput } from './dto/create-post.input';
import { FeedInput } from './dto/feed.input';
import { FeedOuput } from './dto/feed.output';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

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

  // TODO : Check si le post modifié appartient à l'utilisateur connecté
  // TODO : Check si le total des fichier n'est pas supérieur à 4 pendant l'update
  // TODO : Check si il y a au moins 1 media ou un body
  @Mutation(() => Post, { name: 'updatePost' })
  async updatePost(
    @CurrentUser() user: User,
    @Args('input', { nullable: true }) updatePostInput: UpdatePostInput,
    @Args({
      name: 'medias',
      type: () => [GraphQLUpload],
      nullable: true,
    })
    mediasPendings: FileUpload[],
  ) {
    // On attends que tout les fichiers soit résolu avant de les uploads
    const medias = (await Promise.all(mediasPendings || [])) || [];

    const currentPostMedias = await this.postService.getMedias(
      updatePostInput.id,
    );

    const currMediasLength =
      (currentPostMedias?.length || 0) -
      (updatePostInput.mediasRemovedIds?.length || 0) +
      (mediasPendings?.length || 0);

    if (currMediasLength > 4 && !updatePostInput.draftRaw) {
      return new BadRequestException(`4 medias max, ${currMediasLength} given`);
    }

    // if (medias.length === 0 && !updatePostInput.draftRaw) {
    //   return new BadRequestException('We need at least one media or body');
    // }

    const mediasPaths = [];
    for (const media of medias) {
      const file = await FileHandler.upload(media, String(user.id));
      mediasPaths.push(file.uploadPath);
    }

    return this.postService.updateMedias(mediasPaths, updatePostInput);
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

  @Public()
  @Query(() => FeedOuput, { name: 'feed' })
  async getFeed(
    @CurrentUser() user: User,
    @Args('input', { type: () => FeedInput, nullable: true }) input?: FeedInput,
  ) {
    const _input = input || {};
    return this.postService.getFeeds(
      user,
      _input.take,
      _input.page,
      _input.options,
    );
  }

  // @Roles(UserRoles.Admin)
  // @Public()
  // @Query(() => GetPostReportsOutput, { name: 'feed' })
  // async getReports(
  //   @Parent() post: Post,
  //   @Args('input', { type: () => GetPostReportsInput, nullable: true })
  //   input?: FeedInput,
  // ) {
  //   // const _input = input || {};
  //   return this.postService.getReports(post,input);
  // }

  // @Query(() => [Post], { name: 'post' })
  // findAll() {
  //   return this.postService.findAll();
  // }

  // @Query(() => Post, { name: 'post' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.postService.findOne(id);
  // }

  // @Mutation(() => Post)
  // removePost(@Args('id', { type: () => Int }) id: number) {
  //   return this.postService.remove(id);
  // }
}

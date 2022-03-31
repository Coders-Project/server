import { BadRequestException } from '@nestjs/common';
import {
  Args,
  Context,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { AuthService } from '../auth/auth.service';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { Public } from '../auth/dto/public.decorator';
import { Roles } from '../auth/dto/roles.decorator';
import { FileHandler } from '../helpers/FileHandler';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { UserRoles } from '../role/dto/role.enum';
import { User } from '../user/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { FeedInput } from './dto/feed.input';
import { FeedOuput } from './dto/feed.output';
import { FindAllPostInput } from './dto/find-all-post.input';
import { FindAllPostOutput } from './dto/find-all-post.ouput';
import { GetPostReportsInput } from './dto/get-post-reports.input';
import { GetPostReportsOutput } from './dto/get-post-reports.output';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly authService: AuthService,
  ) {}

  @Roles(UserRoles.Admin)
  @Query(() => FindAllPostOutput, { name: 'posts' })
  async getPosts(
    @Args('input', { type: () => FindAllPostInput, nullable: true })
    input?: FindAllPostInput,
  ) {
    return this.postService.findAll(input);
  }

  @Query(() => Post, { name: 'post' })
  async getPost(
    @Args('postId', { type: () => Int })
    postId: number,
  ) {
    return this.postService.findOne(postId);
  }

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
    await this.postService.checkPostBelongToUser(user, updatePostInput.id);

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

  // NOTE : Le role guard est mit au niveau de la fonction getPosts() / query 'posts' car ça ne fonctionne pas ici
  @ResolveField(() => GetPostReportsOutput, { name: 'reports' })
  async getReports(
    @Parent() post: Post,
    @Args('input', { type: () => GetPostReportsInput, nullable: true })
    input?: FeedInput,
  ) {
    return this.postService.getReports(post, input);
  }

  // TODO : Crée un decorator qui gere la verif d'appartenance a une publication ET les roles
  @Mutation(() => Int, { name: 'deletePost' })
  async deletePost(
    @CurrentUser() user: User,
    @Args('postId', { nullable: true }) postId: number,
  ) {
    await this.postService.checkPostBelongToUser(user, postId);
    return this.postService.remove(postId);
  }
}

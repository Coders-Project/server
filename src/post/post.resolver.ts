import { BadRequestException } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { CurrentUser } from 'src/auth/dto/current-user.decorator';
import { FileHandler } from '../helpers/FileHandler';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

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
    if (medias.length === 0 && !createPostInput.body) {
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
  getRole(@Parent() post: Post): Promise<PostMedia[]> {
    return this.postService.getMedias(post.id);
  }

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

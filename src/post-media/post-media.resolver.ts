import { Resolver } from '@nestjs/graphql';
import { PostMedia } from './entities/post-media.entity';
import { PostMediaService } from './post-media.service';

@Resolver(() => PostMedia)
export class PostMediaResolver {
  constructor(private readonly postMediaService: PostMediaService) {}

  // @Mutation(() => PostMedia)
  // createPostMedia(@Args('createPostMediaInput') createPostMediaInput: CreatePostMediaInput) {
  //   return this.postMediaService.create(createPostMediaInput);
  // }

  // @Query(() => [PostMedia], { name: 'postMedia' })
  // findAll() {
  //   return this.postMediaService.findAll();
  // }

  // @Query(() => PostMedia, { name: 'postMedia' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.postMediaService.findOne(id);
  // }

  // @Mutation(() => PostMedia)
  // updatePostMedia(@Args('updatePostMediaInput') updatePostMediaInput: UpdatePostMediaInput) {
  //   return this.postMediaService.update(updatePostMediaInput.id, updatePostMediaInput);
  // }

  // @Mutation(() => PostMedia)
  // removePostMedia(@Args('id', { type: () => Int }) id: number) {
  //   return this.postMediaService.remove(id);
  // }
}

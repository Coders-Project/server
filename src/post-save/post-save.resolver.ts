import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../auth/dto/current-user.decorator';
import { PostService } from '../post/post.service';
import { User } from '../user/entities/user.entity';
import { PostSave } from './entities/post-save.entity';
import { PostSaveService } from './post-save.service';

@Resolver()
export class PostSaveResolver {
  constructor(
    private readonly postSaveService: PostSaveService,
    private readonly postService: PostService,
  ) {}

  @Mutation(() => PostSave, { name: 'toggleSavePost' })
  async reportPost(
    @CurrentUser() user: User,
    @Args({
      name: 'postId',
      type: () => Int,
    })
    postId: number,
  ) {
    return this.postSaveService.toggleSave(user, postId);
  }

  @Query(() => Boolean, { name: 'isSavedPost' })
  async isSavedPost(
    @CurrentUser() user: User,
    @Args({
      name: 'postId',
      type: () => Int,
    })
    postId: number,
  ) {
    const post = await this.postService.findOne(postId);
    return Boolean(await this.postSaveService.isSaved(user, post));
  }
}

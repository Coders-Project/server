import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostTagService } from './post-tag.service';
import { PostTag } from './entities/post-tag.entity';
import { CreatePostTagInput } from './dto/create-post-tag.input';
import { UpdatePostTagInput } from './dto/update-post-tag.input';

@Resolver(() => PostTag)
export class PostTagResolver {
  constructor(private readonly postTagService: PostTagService) {}

  @Mutation(() => PostTag)
  createPostTag(@Args('createPostTagInput') createPostTagInput: CreatePostTagInput) {
    return this.postTagService.create(createPostTagInput);
  }

  @Query(() => [PostTag], { name: 'postTag' })
  findAll() {
    return this.postTagService.findAll();
  }

  @Query(() => PostTag, { name: 'postTag' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postTagService.findOne(id);
  }

  @Mutation(() => PostTag)
  updatePostTag(@Args('updatePostTagInput') updatePostTagInput: UpdatePostTagInput) {
    return this.postTagService.update(updatePostTagInput.id, updatePostTagInput);
  }

  @Mutation(() => PostTag)
  removePostTag(@Args('id', { type: () => Int }) id: number) {
    return this.postTagService.remove(id);
  }
}

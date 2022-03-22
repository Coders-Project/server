import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PostMentionService } from './post-mention.service';
import { PostMention } from './entities/post-mention.entity';
import { CreatePostMentionInput } from './dto/create-post-mention.input';
import { UpdatePostMentionInput } from './dto/update-post-mention.input';

@Resolver(() => PostMention)
export class PostMentionResolver {
  constructor(private readonly postMentionService: PostMentionService) {}

  @Mutation(() => PostMention)
  createPostMention(@Args('createPostMentionInput') createPostMentionInput: CreatePostMentionInput) {
    return this.postMentionService.create(createPostMentionInput);
  }

  @Query(() => [PostMention], { name: 'postMention' })
  findAll() {
    return this.postMentionService.findAll();
  }

  @Query(() => PostMention, { name: 'postMention' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.postMentionService.findOne(id);
  }

  @Mutation(() => PostMention)
  updatePostMention(@Args('updatePostMentionInput') updatePostMentionInput: UpdatePostMentionInput) {
    return this.postMentionService.update(updatePostMentionInput.id, updatePostMentionInput);
  }

  @Mutation(() => PostMention)
  removePostMention(@Args('id', { type: () => Int }) id: number) {
    return this.postMentionService.remove(id);
  }
}

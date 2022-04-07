import { Injectable } from '@nestjs/common';
import { CreatePostMentionInput } from './dto/create-post-mention.input';
import { UpdatePostMentionInput } from './dto/update-post-mention.input';

@Injectable()
export class PostMentionService {
  create(createPostMentionInput: CreatePostMentionInput) {
    return 'This action adds a new postMention';
  }

  findAll() {
    return `This action returns all postMention`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postMention`;
  }

  update(id: number, updatePostMentionInput: UpdatePostMentionInput) {
    return `This action updates a #${id} postMention`;
  }

  remove(id: number) {
    return `This action removes a #${id} postMention`;
  }
}

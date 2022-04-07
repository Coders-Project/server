import { Injectable } from '@nestjs/common';
import { CreatePostMediaInput } from './dto/create-post-media.input';
import { UpdatePostMediaInput } from './dto/update-post-media.input';

@Injectable()
export class PostMediaService {
  create(createPostMediaInput: CreatePostMediaInput) {
    return 'This action adds a new postMedia';
  }

  findAll() {
    return `This action returns all postMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postMedia`;
  }

  update(id: number, updatePostMediaInput: UpdatePostMediaInput) {
    return `This action updates a #${id} postMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} postMedia`;
  }
}

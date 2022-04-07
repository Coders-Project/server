import { Injectable } from '@nestjs/common';
import { CreatePostTagInput } from './dto/create-post-tag.input';
import { UpdatePostTagInput } from './dto/update-post-tag.input';

@Injectable()
export class PostTagService {
  create(createPostTagInput: CreatePostTagInput) {
    return 'This action adds a new postTag';
  }

  findAll() {
    return `This action returns all postTag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postTag`;
  }

  update(id: number, updatePostTagInput: UpdatePostTagInput) {
    return `This action updates a #${id} postTag`;
  }

  remove(id: number) {
    return `This action removes a #${id} postTag`;
  }
}

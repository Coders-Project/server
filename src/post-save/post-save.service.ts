import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { PostService } from '../post/post.service';
import { User } from '../user/entities/user.entity';
import { PostSave } from './entities/post-save.entity';

@Injectable()
export class PostSaveService {
  constructor(
    @InjectRepository(PostSave)
    private readonly postSaveRepository: Repository<PostSave>,
    private readonly postService: PostService,
  ) {}
  /**
   *
   * @param options
   * @returns
   */
  findAll(options: FindManyOptions<PostSave>) {
    return this.postSaveRepository.find(options);
  }
  /**
   *
   * @param options
   * @returns
   */
  isSaved(user: User, post: Post) {
    return this.postSaveRepository.findOne({
      where: {
        user: user,
        post: post,
      },
      relations: ['post', 'user'],
    });
  }
  /**
   *
   * @param user
   * @param postId
   * @returns
   */
  async toggleSave(user: User, postId: number) {
    const post = await this.postService.findOne(postId);

    let currentPostSave = await this.isSaved(user, post);

    if (currentPostSave) {
      await this.postSaveRepository.remove(currentPostSave);
    } else {
      const postSave = new PostSave();
      postSave.post = post;
      postSave.user = user;
      console.log('postSave : ', postSave);

      return postSave.save();
    }
    console.log('currentPostSave : ', currentPostSave);
    return currentPostSave;
  }
}

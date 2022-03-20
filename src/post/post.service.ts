import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { User } from '../user/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostMedia)
    private readonly postMediaRepository: Repository<PostMedia>,
  ) {}

  async create(
    createPostInput: CreatePostInput,
    mediasPaths: string[],
    user: User,
  ) {
    const post = new Post();
    post.body = createPostInput.body;
    post.postParentId = createPostInput.postParentId;
    post.isFollowOnly = createPostInput.isFollowOnly;
    post.user = user;

    for (const path of mediasPaths) {
      const postMedia = new PostMedia();
      postMedia.path = path;
      post.medias = [...(post.medias || []), postMedia];
    }

    return post.save();
  }

  async getMedias(postId: number) {
    const post = await this.findOne(postId);
    return this.postMediaRepository.find({ where: { post } });
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return this.postRepository.findOne(id);
    // return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}

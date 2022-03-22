import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { PostMention } from '../post-mention/entities/post-mention.entity';
import { PostTag } from '../post-tag/entities/post-tag.entity';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    private userService: UserService,
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
    // post.body = createPostInput.body;
    post.draftRaw = createPostInput.draftRaw;
    post.postParentId = createPostInput.postParentId;
    post.isFollowOnly = createPostInput.isFollowOnly;
    post.user = user;

    const tag = new Tag();
    tag.tag = 'toto';

    const postTag = new PostTag();
    postTag.post = post;
    postTag.tag = tag;
    await postTag.save();

    const userFromMention = await this.userService.findOne({
      where: {
        username: 'user2',
      },
    });

    const postMention = new PostMention();
    postMention.user = userFromMention;
    postMention.post = post;
    await postMention.save();

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

  async findPostAuthor(postId: number) {
    // const post = await this.findOne(postId);
    const post = await this.postRepository.findOne(postId, {
      relations: ['user'],
    });
    return post.user;
  }

  async getFeeds(userId: number) {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
      relations: ['followings', 'followers'],
    });

    const followings = user.followings;

    // TODO : Refaire les Follow (car mal fait)
    console.log('FEEDS : ', user);

    const posts = await this.postRepository.findAndCount({
      where: {
        user: In(followings),
      },
    });

    return {
      total: posts[1],
      posts: posts[0],
    };
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

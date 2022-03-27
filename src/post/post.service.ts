import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { PostMention } from '../post-mention/entities/post-mention.entity';
import { PostReport } from '../post-report/entity/post-report.entity';
import { PostTag } from '../post-tag/entities/post-tag.entity';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostInput } from './dto/create-post.input';
import { FeedOptions } from './dto/feed.input';
import { FindAllPostInput } from './dto/find-all-post.input';
import { GetPostReportsInput } from './dto/get-post-reports.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    private userService: UserService,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostMedia)
    private readonly postMediaRepository: Repository<PostMedia>,
    @InjectRepository(PostReport)
    private readonly postReportRepository: Repository<PostReport>,
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

  async updateMedias(
    newMediasPath: string[],
    updatePostInput: UpdatePostInput,
  ) {
    const post = await this.postRepository.findOne(updatePostInput.id, {
      relations: ['medias'],
    });

    // Retirer toutes propriétés nulles
    // A placer dans les helpers
    const filter = <T>(object): T => {
      for (const key in object) {
        if (object[key] === null) {
          delete object[key];
        } else if (typeof object[key] === 'object') {
          filter(object[key]);
        }
      }
      return object;
    };

    const newFields = filter<UpdatePostInput>(updatePostInput);

    // On ajoute les nouveaux medias
    for (const path of newMediasPath) {
      const postMedia = new PostMedia();
      postMedia.path = path;
      postMedia.post = post;
      post.medias = [...(post.medias || []), postMedia];
    }

    // On remplace les property qui sont mise a jour
    const postUpdated = Object.assign(post, newFields) as Post;
    await postUpdated.save();

    // On supprime les medias qui ne sont plus dans le post
    if (updatePostInput.mediasRemovedIds.length > 0) {
      await this.postMediaRepository.delete(updatePostInput.mediasRemovedIds);
    }

    return postUpdated;
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

  async getFeeds(
    user: User,
    take?: number,
    page?: number,
    options: FeedOptions = {},
  ) {
    // const _options = options || {};
    const _take = take || 10;
    const _page = page ? page * _take : 0;

    let idQuery;
    let followings = [];

    if (user) {
      followings = (await this.userService.getFollowings(user.id)).list;
      followings.unshift(user);
    }

    if (options.excludeFollowing) {
      idQuery = Not(In(followings.map((f) => f.id)));
    } else {
      idQuery = In(followings.map((f) => f.id));
    }

    // NOTE : trop de boucle a optimiser...
    const posts = await this.postRepository.findAndCount({
      where: {
        user: {
          id: idQuery,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: _take,
      skip: _page,
    });

    posts[0].forEach((post) => (post.draftRaw = JSON.stringify(post.draftRaw)));

    return {
      total: posts[1],
      list: posts[0],
    };
  }

  async getReports(post: Post, input: GetPostReportsInput) {
    const _input = input || {};
    // const _options = options || {};
    const _take = _input.take || 10;
    const _page = _input.page ? _input.page * _take : 0;

    const posts = await this.postReportRepository.findAndCount({
      where: {
        post: post,
      },
      order: {
        createdAt: 'DESC',
      },
      take: _take,
      skip: _page,
      relations: ['user'],
    });
    // const posts = await this.postReportRepository
    //   .createQueryBuilder('postReport')
    //   .where('postReport.postId = :postId', { postId: post.id })
    //   .orderBy('postReport.createdAt', 'DESC')
    //   .leftJoinAndSelect('postReport.user', 'user')
    //   .take(_take)
    //   .skip(_page)
    //   .getManyAndCount();

    console.log(posts);

    return {
      total: posts[1],
      list: posts[0],
      // total: 10,
      // list: [],
    };
  }

  async findAll(input: FindAllPostInput) {
    const _input = input || {};
    // const _options = options || {};
    const _take = _input.take || 10;
    const _page = _input.page ? _input.page * _take : 0;

    const result = await this.postRepository.findAndCount({
      take: _take,
      skip: _page,
    });

    // const result = await this.postRepository
    //   .createQueryBuilder('post')

    //   // .loadRelationCountAndMap('post.reportCount', 'reports', 'reportCount')
    //   .loadRelationCountAndMap('post.reportsCount', 'post.reports', 'reports')
    //   .addSelect('COUNT(*)', 'reportsCount')
    //   // .having('post.reports')
    //   // .orderBy('reports', 'DESC')
    //   .orderBy('reportsCount', 'DESC')
    //   // .stream()
    //   // .having('reports > 0')
    //   // .leftJoin('COUNT(post.reports)', 'reports')
    //   // .where('post.reportCount > 0')
    //   // .having('COUNT(post.reports) > 0')
    //   // .where('reports > 0')
    //   // .select('*', 'post')
    //   // .select('COUNT(reports.userId)', 'reportsCount')
    //   // .select('COUNT(reports.userId)', 'reportsCount')
    //   // .having('COUNT(reportsCount) > 0')
    //   // .having('COUNT(*) > 0')
    //   // .where('reports > 0')
    //   .take(_take)
    //   .skip(_page)
    //   .getManyAndCount();

    result[0].forEach(
      (post) => (post.draftRaw = JSON.stringify(post.draftRaw)),
    );

    return {
      total: result[1],
      list: result[0],
    };
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

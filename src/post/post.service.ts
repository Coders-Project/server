import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { PostMedia } from '../post-media/entities/post-media.entity';
import { PostReply } from '../post-reply/entities/post-reply.entity';
import { PostReport } from '../post-report/entity/post-report.entity';
import { UserRoles } from '../role/dto/role.enum';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreatePostInput } from './dto/create-post.input';
import { FeedOptions } from './dto/feed.input';
import { FindAllPostInput } from './dto/find-all-post.input';
import { GetPostReportsInput } from './dto/get-post-reports.input';
import { PostPaginationInput } from './dto/post-pagination.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    private userService: UserService,
    @InjectEntityManager() private manager: EntityManager,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(PostMedia)
    private readonly postMediaRepository: Repository<PostMedia>,
    @InjectRepository(PostReport)
    private readonly postReportRepository: Repository<PostReport>,
    @InjectRepository(PostReply)
    private readonly postReplyRepository: Repository<PostReply>,
    private readonly authService: AuthService,
  ) {}

  async create(
    createPostInput: CreatePostInput,
    mediasPaths: string[],
    user: User,
  ) {
    const post = new Post();
    post.draftRaw = createPostInput.draftRaw;
    post.isFollowOnly = createPostInput.isFollowOnly;
    post.user = user;

    for (const path of mediasPaths) {
      const postMedia = new PostMedia();
      postMedia.path = path;
      post.medias = [...(post.medias || []), postMedia];
    }

    if (createPostInput.postParentId) {
      const parentPost = await this.findOne(createPostInput.postParentId);
      if (parentPost) {
        post.parent = parentPost;
      }
    }

    await post.save();
    await post.reload();

    post.draftRaw = JSON.stringify(post.draftRaw);

    return post;
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
        // Récupere que les posts qui ne sont pas des reponses
        parent: null,
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
    const _take = _input.take || 10;
    const _page = _input.page ? _input.page * _take : 0;

    // TODO Faire des options :
    // - Recuperer que les reports
    // etc...
    const result = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.reports', 'reports')
      .where('reports.postId = post.id')
      .orderBy('reports.createdAt', 'DESC')
      .take(_take)
      .skip(_page)
      .getManyAndCount();

    result[0].forEach(
      (post) => (post.draftRaw = JSON.stringify(post.draftRaw)),
    );

    return {
      total: result[1],
      list: result[0],
    };
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne(id);
    if (post) {
      post.draftRaw = JSON.stringify(post.draftRaw);
    } else {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return post;
  }

  async getReplies(post: Post, input: PostPaginationInput) {
    const postWithRepliesTest = await this.manager
      .getTreeRepository(Post)
      .findAndCount({
        where: {
          parent: post,
        },
        order: {
          createdAt: 'DESC',
        },
        // depth: 1,
      });

    return {
      total: postWithRepliesTest[1],
      list: postWithRepliesTest[0].map((el) => {
        if (el.draftRaw) el.draftRaw = JSON.stringify(el.draftRaw);
        return el;
      }),
    };
  }

  async getParents(post: Post, input: PostPaginationInput) {
    const postWithParents = await this.manager
      .getTreeRepository(Post)
      .findAncestors(post, {
        // depth: 1,
      });

    const parentsCount = await this.manager
      .getTreeRepository(Post)
      .countAncestors(post);
    // const postWithParentsTest = await this.manager
    //   .getTreeRepository(Post)
    //   .findAndCount({
    //     where: {
    //       // parent: post,
    //       children: [post],
    //     },
    //     // depth: 1,
    //   });
    console.log('PARENT TREE : ');
    console.log('PARENT TREE : ');
    console.log('PARENT TREE : ');
    console.log('PARENT TREE : ');
    console.log('PARENT TREE : ', postWithParents);
    return {
      // total: postWithParentsTest[1],
      total: parentsCount,
      list: postWithParents.map((el) => {
        if (el.draftRaw) el.draftRaw = JSON.stringify(el.draftRaw);
        return el;
      }),
      // list: postWithParentsTest[0]?.map((el) => {
      //   if (el.draftRaw) el.draftRaw = JSON.stringify(el.draftRaw);
      //   return el;
      // }),
    };
    // return postWithParents?.map((el) => {
    //   if (el.draftRaw) el.draftRaw = JSON.stringify(el.draftRaw);
    //   return el;
    // });
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    const deletedPost = await this.postRepository.findOne(id);
    if (deletedPost) {
      await deletedPost.remove();
    } else {
      throw new NotFoundException(`Post with id ${id} not found`);
    }
    return id;
  }
  /**
   * Verifie si un post appartient a un utilisateur
   * @param user
   * @param postId
   * @returns
   */
  async checkPostBelongToUser(user: User, postId: number) {
    const post = await this.postRepository.findOne(postId, {
      relations: ['user'],
    });

    if (this.authService.hasAccess(user, [UserRoles.Admin])) {
      return true;
    }

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} not found`);
    } else if (post.user.id !== user.id) {
      throw new UnauthorizedException(`You can't access this post`);
    }
  }
}

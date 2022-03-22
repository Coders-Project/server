import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, FindOneOptions, Repository } from 'typeorm';
import { Follow } from '../follower/entities/follower.entity';
import { UserRoles } from '../role/dto/role.enum';
import { Role } from '../role/entities/role.entity';
import { Post } from './../post/entities/post.entity';
import { Profile } from './../profile/entites/profile.entity';
// import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { FollowOutput } from './dto/follow.output';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private connection: Connection,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createuserInput: CreateUserInput) {
    const userAlreadyExist = await this.findByEmail(createuserInput.email);

    if (userAlreadyExist) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersRepository.create({
      ...createuserInput,
    });

    // On crée le profile du user
    const profile = this.profileRepository.create();
    profile.displayname = createuserInput.username;
    await this.profileRepository.save(profile);
    user.profile = profile;

    // On assigne le role User par défaut
    const role = new Role();
    role.level = UserRoles.User;
    user.roles = [role];

    await this.usersRepository.save(user);

    return user;
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      email,
    });
  }

  async findAll(take?: number, page?: number) {
    const _take = take || 10;
    const _page = page * _take || 0;

    const result = await this.usersRepository.findAndCount({
      skip: _page,
      take: _take,
    });

    return {
      total: result[1],
      users: result[0],
    };
  }

  async getRole(id: number) {
    const user = await this.usersRepository.findOne(id, {
      relations: ['roles'],
    });
    return user.roles;
  }

  async getProfile(id: number) {
    const user = await this.usersRepository.findOne(id, {
      relations: ['profile'],
    });
    return user.profile;
  }

  async findOne(options: FindOneOptions<User>) {
    return this.usersRepository.findOne(options);
  }

  async update(userId: number, updateInput: UpdateUserInput) {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['profile'],
    });

    const filter = (object) => {
      for (const key in object) {
        if (object[key] === null) {
          delete object[key];
        } else if (typeof object[key] === 'object') {
          filter(object[key]);
        }
      }
      return object;
    };

    const newFields = filter(updateInput);

    const profile = Object.assign(user.profile, newFields.profile) as Profile;

    const userUpdated = Object.assign(user, newFields) as User;

    user.profile = profile;

    return userUpdated.save();
  }

  async toggleFollow(followerId: number, followingId: number) {
    // Empeche de se follow soi-meme
    if (followerId === followingId) throw new BadRequestException();

    const follower = await this.usersRepository.findOne(followerId);
    const following = await this.usersRepository.findOne(followingId);

    const isCurrentFollow = await this.isFollow(followerId, followingId);

    if (isCurrentFollow) {
      await this.followRepository.delete(isCurrentFollow);
    } else {
      const follow = new Follow();
      follow.follower = follower;
      follow.following = following;
      await follow.save();
    }

    return { follower, following };
  }

  async getFollowers(userId: number, take?: number, page?: number) {
    const _take = take || 10;
    const _page = page ? page * _take : 0;

    const result = await this.followRepository.findAndCount({
      where: {
        followingId: userId,
      },
      take: _take,
      skip: _page,
      relations: ['follower'],
    });

    return {
      total: result[1],
      list: result[0].map((r) => r.follower),
    };
  }

  async getFollowings(
    userId: number,
    take?: number,
    page?: number,
  ): Promise<FollowOutput> {
    const _take = take || 10;
    const _page = page ? page * _take : 0;

    const result = await this.followRepository.findAndCount({
      where: {
        followerId: userId,
      },
      take: _take,
      skip: _page,
      relations: ['following'],
    });

    return {
      total: result[1],
      list: result[0].map((r) => r.following),
    };
  }

  async getPosts(userId: number, take?: number, page?: number): Promise<any> {
    const _take = take || 10;
    const _page = page ? page * _take : 0;

    const user = await this.findOne({ where: { id: userId } });

    console.log('User for posts', user);

    let result = await this.postRepository.findAndCount({
      where: {
        user: user,
      },
      take: _take,
      skip: _page,
    });

    result[0] = result[0].map((post) => {
      post.draftRaw = JSON.stringify(post.draftRaw);
      return post;
    });

    console.log('Posts', result);

    return {
      total: result[1],
      list: result[0],
    };
  }

  isFollow(followerId: number, followingId: number) {
    return this.followRepository.findOne({
      where: {
        followerId: followerId,
        followingId: followingId,
      },
    });
  }

  async deleteFollower(followerId: number, followingId: number) {
    await this.followRepository.delete({
      followerId: followerId,
      followingId: followingId,
    });
  }

  // getFollowers (user) {

  // }
  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

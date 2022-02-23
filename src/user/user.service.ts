import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './../profile/entites/profile.entity';
// import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
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

    const profile = this.profileRepository.create();
    await this.profileRepository.save(profile);
    user.profile = profile;

    // const role = new Role();
    // role.id = UserRoles.User;
    // user.roles = [role];

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

  async findOne(id: number) {
    return this.usersRepository.findOne(id);
  }

  async update(userId: number, updateInput: UpdateUserInput) {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['profile'],
    });

    user.profile = Object.assign(user.profile, updateInput.profile);

    return (await this.usersRepository.save(
      Object.assign(user, updateInput.user),
    )) as User;
    // te.
    // return te;
    // return this.usersRepository.findOne(userId);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}

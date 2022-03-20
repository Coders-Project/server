import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from '../follower/entities/follower.entity';
import { Post } from '../post/entities/post.entity';
import { Profile } from '../profile/entites/profile.entity';
import { User } from './entities/user.entity';
import { userResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User, Profile, Follow, Post]),
  ],
  providers: [userResolver, UserService],
  exports: [UserService],
})
export class UserModule {}

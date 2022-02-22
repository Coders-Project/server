import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entites/profile.entity';
import { User } from './entities/user.entity';
import { userResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User, Profile])],
  providers: [userResolver, UserService],
  exports: [UserService],
})
export class UserModule {}

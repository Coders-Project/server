// TODO : Faire fonctionner cette entity !

import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity('user_follow')
export class Follow extends BaseEntity {
  // @Field(() => User)
  // @ManyToOne(() => User, (user) => user.followers, { primary: true })
  // @JoinColumn({ name: 'follower_id' })
  // follower: User;

  // @Field(() => User)
  // @ManyToOne(() => User, (user) => user.followings, { primary: true })
  // @JoinColumn({ name: 'following_id' })
  // following: User;
  @PrimaryColumn({ name: 'follower_id' })
  followerId: number;

  @PrimaryColumn({ name: 'following_id' })
  followingId: number;

  @Field(() => User)
  // @ManyToOne(() => User, (user) => user.followers, { primary: true })
  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @Field(() => User)
  // @ManyToOne(() => User, (user) => user.followings, { primary: true })
  @ManyToOne(() => User, (user) => user.followings)
  @JoinColumn({ name: 'following_id' })
  following: User;
}

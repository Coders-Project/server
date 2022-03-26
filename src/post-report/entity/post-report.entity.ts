import { Field, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class PostReport extends BaseEntity {
  @Field(() => String)
  @Column()
  @Length(1, 150)
  reason: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => User)
  @ManyToOne(() => User, { primary: true })
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, { primary: true })
  post: Post;
}

import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, CreateDateColumn, Entity, ManyToOne } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

// @InputType()
@ObjectType()
@Entity()
export class PostSave extends BaseEntity {
  @Field(() => Date)
  @CreateDateColumn()
  createdAt: string;

  @Field(() => User)
  @ManyToOne(() => User, { primary: true, onDelete: 'CASCADE' })
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, { primary: true, onDelete: 'CASCADE' })
  post: Post;
}

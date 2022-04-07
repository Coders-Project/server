import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Entity, ManyToOne } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class PostMention extends BaseEntity {
  @Field(() => User)
  @ManyToOne(() => User, { primary: true, cascade: true })
  user: User;

  @Field(() => Post)
  @ManyToOne(() => Post, { primary: true, cascade: true, onDelete: 'CASCADE' })
  post: Post;
}

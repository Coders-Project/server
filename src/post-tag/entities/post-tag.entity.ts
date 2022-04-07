import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity, Entity, ManyToOne } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Tag } from '../../tag/entities/tag.entity';

@ObjectType()
@Entity()
export class PostTag extends BaseEntity {
  @Field(() => Tag)
  @ManyToOne(() => Tag, { primary: true, cascade: true })
  tag: Tag;

  @Field(() => Post)
  @ManyToOne(() => Post, { primary: true, cascade: true, onDelete: 'CASCADE' })
  post: Post;
}

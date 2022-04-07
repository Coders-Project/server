import { Field, Int } from '@nestjs/graphql';
import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Tree('closure-table')
// @ObjectType()
@Entity()
export class PostReply extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // @Field(() => Post)
  // @ManyToOne(() => Post, (post) => post.parents, {
  //   primary: true,
  //   nullable: false,
  //   // cascade: true,
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'post_id' })
  // post: Post;

  // @TreeParent()
  // @Field(() => Post)
  // @ManyToOne(() => Post, (post) => post.replies, {
  //   primary: true,
  //   nullable: false,
  //   // cascade: true,s
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'parent_id' })
  // parentPost: Post;
}

import { Field, Int, ObjectType } from '@nestjs/graphql';
import { validateOrReject } from 'class-validator';
import { RawDraftContentState } from 'draft-js';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostMedia } from '../../post-media/entities/post-media.entity';
import { PostReport } from '../../post-report/entity/post-report.entity';
import { User } from '../../user/entities/user.entity';

@ObjectType('Post')
@Entity('post')
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  // @Field(() => String, { nullable: true })
  // @Column({ nullable: true })
  // // @MaxLength(300)
  // body: string;

  @Field(() => String, {
    nullable: true,
    description: 'Raw generated by Draft.js',
  })
  @Column({ nullable: true, type: 'json' })
  draftRaw: RawDraftContentState | string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  postParentId?: number;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  isFollowOnly: boolean;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.posts)
  user: User;

  @Field(() => PostMedia)
  @OneToMany((type) => PostMedia, (postMedia) => postMedia.post, {
    cascade: true,
  })
  medias: PostMedia[];

  @Field(() => PostReport)
  @OneToMany((type) => PostReport, (postReport) => postReport.post, {
    cascade: true,
  })
  reports: PostReport[];

  @BeforeUpdate()
  @BeforeInsert()
  validate() {
    return validateOrReject(this);
  }

  @BeforeInsert()
  defaultIsFollowOnly() {
    if (this.isFollowOnly === null) {
      this.isFollowOnly = false;
    }
  }
}

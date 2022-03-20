// TODO : Faire fonctionner cette entity !

import { Field, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

@ObjectType()
@Entity('report_user')
export class ReportUserEntity extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'user_reported_id' })
  userReportedId: number;

  @Field(() => String)
  @Column()
  @Length(1, 150)
  reason: string;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => User)
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_reported_id' })
  userReported: User;
}

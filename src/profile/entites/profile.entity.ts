import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Length, validateOrReject } from 'class-validator';
import {
  BaseEntity,
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class Profile extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, length: 50 })
  @Length(1, 50)
  displayname: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, length: 300, default: '' })
  @Length(0, 300)
  bio: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
    length: 300,
    default: '/default/avatar-picture.png',
    name: 'profile_picture',
  })
  @Length(0, 4096)
  profilePicture: string;

  @Field(() => String, { nullable: true })
  @Column({
    nullable: true,
    length: 300,
    default: '/default/banner-picture.png',
    name: 'background_picture',
  })
  @Length(0, 4096)
  backroundPicture: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile)
  user: User;

  //   @BeforeInsert()
  @BeforeUpdate()
  validate() {
    return validateOrReject(this);
  }
}

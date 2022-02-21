import { Field, ObjectType } from '@nestjs/graphql';
import { Length, validateOrReject } from 'class-validator';
import {
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, length: 50 })
  @Length(1, 50)
  displayName: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, length: 300 })
  @Length(1, 300)
  bio: string;

  @Field(() => User)
  @OneToOne(() => User, (profile) => profile.profile)
  user: number;

  //   @BeforeInsert()
  @BeforeUpdate()
  validate() {
    return validateOrReject(this);
  }
}

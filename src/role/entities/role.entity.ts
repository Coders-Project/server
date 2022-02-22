import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserRoles } from '../dto/role.enum';

@ObjectType()
@Entity()
export class Role {
  @Field(() => String)
  @PrimaryColumn()
  id: UserRoles;

  @Field(() => String)
  @Column()
  label: string;

  @Field(() => User)
  @OneToMany(() => User, (user) => user.role)
  user: User;
}

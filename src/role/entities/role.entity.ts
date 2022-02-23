import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
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
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}

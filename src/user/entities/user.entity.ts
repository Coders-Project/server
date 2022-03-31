import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { hash } from 'bcrypt';
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  validateOrReject,
} from 'class-validator';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Follow } from '../../follower/entities/follower.entity';
import { PostSave } from '../../post-save/entities/post-save.entity';
import { Post } from '../../post/entities/post.entity';
import { Profile } from '../../profile/entites/profile.entity';
import { UserRoles } from '../../role/dto/role.enum';
import { Role } from '../../role/entities/role.entity';

/**
 * NOTE : Modifier le Omit() dans update-user.input.ts a chaque ajout de champ dans cette entité
 */
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ unique: true, length: 45 })
  @Length(2, 45)
  @IsString()
  // Accepte que les lettres et les nombres SANS espaces et caractéres spéciaux
  @Matches(/^[a-zA-Z0-9_-]*$/)
  username: string;

  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  @IsEmail()
  email: string;

  @HideField()
  @Column()
  @IsString()
  @Length(5, 250)
  password: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Role)
  // eager permet de join automatiquement la relation au fetch du user
  @ManyToMany(() => Role, { cascade: true, eager: true })
  @JoinTable({ name: 'user_role' })
  roles: Role[];

  @Field(() => Profile)
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @Field(() => User)
  @OneToMany((type) => Follow, (user) => user.following, { cascade: true })
  followers: User[];

  @Field(() => User)
  @OneToMany((type) => Follow, (user) => user.user, { cascade: true })
  followings: User[];

  @Field(() => Post)
  @OneToMany((type) => Post, (post) => post.user)
  posts: Post[];

  @Field(() => PostSave)
  @OneToMany((type) => PostSave, (post) => post.user)
  savedPost: PostSave[];

  // TODO : Enlever ce field
  @Field(() => Boolean)
  isFollow: boolean;

  // Verifie si les valeurs des propriétés sont valide avant l'insertion
  @BeforeInsert()
  @BeforeUpdate()
  validate() {
    return validateOrReject(this);
  }

  // Hash le password avant l'insertion
  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  // Assigne le role User par défaut avant l'insertion
  // ! Ne fonctionne pas
  // ! Inserer manullement le role par defaut dans le fonction user.create() et dans le user seeder
  @BeforeInsert()
  async defaultRole() {
    if (this.roles || this.roles?.length >= 1) return;

    const role = new Role();
    role.level = UserRoles.User;

    this.roles = [role];
  }
}

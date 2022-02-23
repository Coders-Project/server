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
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../../profile/entites/profile.entity';
import { UserRoles } from '../../role/dto/role.enum';
import { Role } from '../../role/entities/role.entity';
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

  // @Field(() => Role)
  // @ManyToOne(() => Role, (role) => role.user)
  // @JoinColumn()
  // role: Role;
  @Field(() => Role)
  // @ManyToMany(() => Role, (role) => role.users, { cascade: true, eager: true })
  @ManyToMany(() => Role, { cascade: true, eager: true })
  @JoinTable()
  // roles: Role[] = [(new Role().id = UserRoles.User)];
  roles: Role[];

  @Field(() => Profile)
  @OneToOne(() => Profile, (role) => role.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

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
  // @Default
  // constructor(private repo: Repos) {
  //   // const role = new Role();
  //   // role.id = UserRoles.User;
  //   // // console.log(role);
  //   // this.roles = [role];
  // }

  // Assigne le role User par défaut avant l'insertion
  // @BeforeInsert()
  @BeforeInsert()
  async defaultRole() {
    console.log('DEFAULT ROLE');
    if (this.roles || this.roles?.length >= 1) return;

    const role = new Role();
    role.id = UserRoles.User;
    console.log(role);
    // this
    // this.roles = [role.id];
    // this.roles = [role];
    // this.role = role;

    await this.save();
    // await this.reload();

    console.log('this ', this);
    console.log('this.ROLL ', this.roles);
    // this.roles = role;
    // return this;
  }
}

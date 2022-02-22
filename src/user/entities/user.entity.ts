import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { hash } from 'bcrypt';
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  validateOrReject,
} from 'class-validator';
import { UserRoles } from 'src/role/dto/role.enum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from '../../profile/entites/profile.entity';
import { Role } from '../../role/entities/role.entity';

@ObjectType()
@Entity()
export class User {
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
  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role: Role;

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

  // Assigne le role User par défaut avant l'insertion
  @BeforeInsert()
  async defaultRole() {
    if (this.role) return;
    const role = new Role();
    role.id = UserRoles.User;
    this.role = role;
  }
}

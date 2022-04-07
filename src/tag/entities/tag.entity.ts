import { Field, ObjectType } from '@nestjs/graphql';
import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Tag {
  @Field(() => String)
  @PrimaryColumn()
  tag: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: number;
}

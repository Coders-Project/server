import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class CreateUserInput extends PickType(
  User,
  ['username', 'email', 'password'] as const,
  InputType,
) {
  @Field(() => String)
  password: string;
}

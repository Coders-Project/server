import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  accessToken: string;

  @Field(() => User)
  user: User;
}

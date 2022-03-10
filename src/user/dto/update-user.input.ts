import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import { ProfileWithoutUser } from '../../profile/dto/profile-without-user.input';
import { User } from '../entities/user.entity';

@InputType()
class SubUpdateProfileInput extends PartialType(
  ProfileWithoutUser,
  // OmitType(ProfileWithoutUser, ['profilePicture', 'backroundPicture']),
  InputType,
) {
  // @Field(() => GraphQLUpload, { nullable: true })
  // backroundPictureFile: FileUpload;
  // @Field(() => GraphQLUpload, { nullable: true })
  // profilePictureFile: FileUpload;
}
@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(
    User,
    ['id', 'password', 'createdAt', 'roles', 'profile'],
    InputType,
  ),
) {
  @Field(() => SubUpdateProfileInput, { nullable: true })
  profile: SubUpdateProfileInput;
}

// @InputType()
// class SubUpdateUserInput extends PartialType(
//   OmitType(User, ['createdAt', 'id', 'roles', 'profile'], InputType),
// ) {}

// @InputType()
// export class UpdateUserInput {
//   @Field(() => SubUpdateUserInput, { nullable: true })
//   user: SubUpdateUserInput;
//   @Field(() => SubUpdateProfileInput, { nullable: true })
//   profile: SubUpdateProfileInput;
// }
// @InputType()
// export class UpdateUserInput extends IntersectionType(
//   PartialType(
//     OmitType(User, ['password', 'createdAt', 'roles', 'profile'], InputType),
//   ),
//   PartialType(ProfileWithoutUser),
// ) {
//   // @Field(() => ProfileWithoutUser, { nullable: true })
//   // profile: ProfileWithoutUser;
// }

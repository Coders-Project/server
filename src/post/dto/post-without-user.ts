import { ObjectType, OmitType } from '@nestjs/graphql';
import { Post } from '../entities/post.entity';

@ObjectType()
export class PostWithoutUser extends OmitType(Post, ['user'], ObjectType) {}

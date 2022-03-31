import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from '../post/post.module';
import { PostSave } from './entities/post-save.entity';
import { PostSaveResolver } from './post-save.resolver';
import { PostSaveService } from './post-save.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostSave]), PostModule],
  providers: [PostSaveResolver, PostSaveService],
})
export class PostSaveModule {}

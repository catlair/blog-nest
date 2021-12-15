import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag, TagSchema } from './schema/tag.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    ArticlesModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}

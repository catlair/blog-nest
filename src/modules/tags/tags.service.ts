import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesService } from '../articles/articles.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './schema/tag.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    private readonly articlesService: ArticlesService,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagModel.create(createTagDto);
  }

  findAll() {
    return this.tagModel.find();
  }

  async findOne(id: string) {
    const tag = await this.tagModel.findById(id);
    return await this.articlesService.findAllByTag(tag.name);
  }

  remove(id: string) {
    return this.tagModel.findByIdAndRemove(id);
  }
}

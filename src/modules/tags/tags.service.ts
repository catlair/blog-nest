import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesService } from '../articles/articles.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './schema/tag.schema';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<TagDocument>,
    @Inject(forwardRef(() => ArticlesService))
    private readonly articlesService: ArticlesService,
  ) {}

  create(createTagDto: CreateTagDto) {
    return this.tagModel.create(createTagDto);
  }

  /**
   * 创建多个标签
   */
  async createMany(tags: string[]) {
    const dtos = tags.map((tag) => ({ name: tag }));
    return await this.tagModel.insertMany(dtos);
  }

  async findAll() {
    const tags = await this.tagModel.find().lean();
    return await this.articlesService.getNumsByKey(tags, 'tags');
  }

  async findAllByName(names: string[]) {
    const tags = await this.tagModel.find({ name: { $in: names } });
    return tags;
  }

  async findOne(id: string) {
    const tag = await this.tagModel.findById(id);
    return await this.articlesService.findAllByTag(tag.name);
  }

  async findOneByName(name: string) {
    return await this.articlesService.findAllByTag(name);
  }

  remove(id: string) {
    return this.tagModel.findByIdAndRemove(id);
  }

  /**
   * 删除多个标签
   */
  async removeMany(names: string[]): Promise<any> {
    return await this.tagModel.deleteMany({ name: { $in: names } });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag, TagDocument } from './schema/tag.schema';

@Injectable()
export class TagsService {
  constructor(@InjectModel(Tag.name) private tagModel: Model<TagDocument>) {}

  create(createTagDto: CreateTagDto) {
    return this.tagModel.create(createTagDto);
  }

  findAll() {
    return this.tagModel.find();
  }

  findOne(id: string) {
    return `查找所有${id}的文章`;
  }

  remove(id: string) {
    return this.tagModel.findByIdAndRemove(id);
  }
}

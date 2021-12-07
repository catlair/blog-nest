import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  findAll() {
    return this.categoryModel.find();
  }

  findOne(id: string) {
    return `返回分类id为${id}的文章`;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto): any {
    return this.categoryModel.updateOne({ _id: id }, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndRemove(id);
  }
}

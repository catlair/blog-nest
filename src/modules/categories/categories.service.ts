import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ArticlesService } from '../articles/articles.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly articlesService: ArticlesService,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  findAll() {
    return this.categoryModel.find();
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findById(id);
    return await this.articlesService.findAllByCategory(category.name);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto): any {
    return this.categoryModel.updateOne({ _id: id }, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndRemove(id);
  }
}

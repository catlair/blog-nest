import { ResponseException } from '@/exception';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
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
    @Inject(forwardRef(() => ArticlesService))
    private readonly articlesService: ArticlesService,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryModel.create(createCategoryDto);
  }

  async findAll() {
    const categories = await this.categoryModel.find().lean();
    return await this.articlesService.getNumsByKey(categories, 'category');
  }

  private async getArticleByCategoryName(category: any) {
    if (!category) {
      throw new ResponseException('分类不存在');
    }
    return await this.articlesService.findAllByCategory(category.name);
  }

  async findOne(id: string) {
    const category = await this.categoryModel.findOne({ _id: id });
    return await this.getArticleByCategoryName(category);
  }

  async findOneByName(name: string) {
    const category = await this.categoryModel.findOne({ name });
    return await this.getArticleByCategoryName(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<any> {
    const articles = await this.findOne(id);
    const category = await this.categoryModel.updateOne(
      { _id: id },
      updateCategoryDto,
    );

    await Promise.all(
      articles.list &&
        articles.list.map((article) => {
          this.articlesService.update(
            article._id,
            {
              category: updateCategoryDto.name,
            },
            true,
          );
        }),
    );
    return category;
  }

  async remove(id: string) {
    return await this.categoryModel.findByIdAndRemove(id);
  }
}

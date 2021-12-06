import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article, ArticleDocument } from './schemas/article.schema';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  create(createArticleDto: CreateArticleDto) {
    return this.articleModel.create(createArticleDto);
  }

  async findAll(page: number, size: number) {
    if (!page) {
      throw new BadRequestException('缺少参数 pn');
    }
    if (!size) {
      throw new BadRequestException('缺少参数 ps');
    }

    if (size > 50) {
      throw new BadRequestException('ps 最大值为 50');
    }

    return await this.articleModel
      .find({})
      .skip((page - 1) * size)
      .limit(size);
  }

  findOne(id: string) {
    return this.articleModel.findOne({ _id: id });
  }

  update(id: string, updateArticleDto: UpdateArticleDto): any {
    return this.articleModel.updateOne({ _id: id }, updateArticleDto);
  }

  remove(id: string) {
    return `This action removes a #${id} article`;
  }
}

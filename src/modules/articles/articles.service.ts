import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ArticleStatusEnum,
  ArticleVisibilityEnum,
} from '@/enums/article-status.enums';
import { Role } from '@/enums/role.enum';
import { ResponseException } from '@/exception';
import type { MgReUserType } from '@/types';
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

  async findAll(page = 1, size = 20) {
    if (!page) {
      throw new BadRequestException('缺少参数 pn');
    }
    if (!size) {
      throw new BadRequestException('缺少参数 ps');
    }

    if (size > 50) {
      throw new BadRequestException('ps 最大值为 50');
    }

    const [articles, count] = await Promise.all([
      this.articleModel
        .find({})
        .skip((page - 1) * size)
        .limit(size)
        .select('-content'),
      this.articleModel.countDocuments(),
    ]);

    return {
      list: articles,
      totalPage: Math.ceil(count / size),
      total: count,
      curPage: page,
    };
  }

  async findOne(id: string, user: MgReUserType) {
    const article = await this.articleModel.findOne({ _id: id });

    switch (article.visibility) {
      case ArticleVisibilityEnum.PUBLIC:
        return article;
      case ArticleVisibilityEnum.LOGIN:
        if (user?._id) {
          return article;
        } else {
          throw new ResponseException('登录后才能查看', 1001);
        }
      case ArticleVisibilityEnum.COMMENT:
        // 查看评论
        if (user?._id) {
          return article;
        } else {
          throw new ResponseException('评论后才能查看', 1002);
        }
      case ArticleVisibilityEnum.PRIVATE:
        if (user?._id) {
          return article;
        } else {
          throw new ResponseException('文章为私有文章', 1003);
        }
      default:
        throw new ResponseException('没有权限', 1004);
    }
  }

  async findById(id: string) {
    return this.articleModel.findById(id);
  }

  findAllByUserId(userId: string, page = 1, size = 20) {
    if (!page) {
      throw new BadRequestException('缺少参数 pn');
    }
    if (!size) {
      throw new BadRequestException('缺少参数 ps');
    }

    if (size > 50) {
      throw new BadRequestException('ps 最大值为 50');
    }

    return this.articleModel
      .find({ author: userId })
      .skip((page - 1) * size)
      .limit(size);
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: MgReUserType,
  ) {
    if (user.roles.includes(Role.Admin)) {
      return this.articleModel.findByIdAndUpdate({ _id: id }, updateArticleDto);
    }
    if (user._id.toString() !== id) {
      throw new ResponseException('没有权限', 1004);
    }

    const article = await this.articleModel.findById(id);

    updateArticleDto.isTop = article.isTop;
    updateArticleDto.status =
      article.status === ArticleStatusEnum.DELETED
        ? ArticleStatusEnum.DELETED
        : updateArticleDto.status;

    return this.articleModel.findByIdAndUpdate({ _id: id }, updateArticleDto);
  }

  async findAllByTag(name: string, page = 1, size = 20) {
    page ||= 1;
    size ||= 20;
    const [articles, count] = await Promise.all([
      this.articleModel
        .find({ tags: { $in: [name] } })
        .skip((page - 1) * size)
        .limit(size),
      this.articleModel.countDocuments({ tags: { $in: [name] } }),
    ]);

    return {
      list: articles,
      totalPage: Math.ceil(count / size),
      total: count,
      curPage: page,
    };
  }

  async findAllByCategory(name: string, page = 1, size = 20) {
    page ||= 1;
    size ||= 20;
    const [articles, count] = await Promise.all([
      this.articleModel
        .find({ category: name })
        .skip((page - 1) * size)
        .limit(size),
      this.articleModel.countDocuments({ category: name }),
    ]);

    return {
      list: articles,
      totalPage: Math.ceil(count / size),
      total: count,
      curPage: page,
    };
  }

  remove(id: string): any {
    return this.articleModel.deleteOne({ _id: id });
  }
}

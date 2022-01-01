import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument, Model } from 'mongoose';
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
import { TagsService } from '../tags/tags.service';
import { CommentsService } from '../comments/comments.service';
import { isArray, isBoolean } from '@/utils/is';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    private readonly tagsService: TagsService,
    private readonly commentsService: CommentsService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const artTags = createArticleDto.tags;
    const noneTags = [];
    // 判断是否有不存在的标签
    const tagsDoc = await this.tagsService.findAllByName(artTags);
    const tags = tagsDoc.map((tag) => tag.name);
    const isMatch = artTags.filter((v) => {
      if (!tags.includes(v)) {
        noneTags.push(v);
        return true;
      }
    }).length;
    // 如果有不存在的标签，则创建
    if (isMatch !== 0) {
      await this.tagsService.createMany(noneTags);
    }
    return await this.articleModel.create(createArticleDto);
  }

  private findAllHandleQuery(query: any, user?: MgReUserType) {
    const page = Number(query.pn) || 0;
    const size = Number(query.ps) || 0;
    let { sort, $nin, $in } = query;
    const fitlerObj = {};
    const sortObj = {};

    // if (!user) {
    //   fitlerObj['status'] = {
    //     $nin: [ArticleStatusEnum.DRAFT, ArticleStatusEnum.DELETED],
    //   };
    //   return {
    //     page,
    //     size,
    //     sort: sortObj,
    //     filter: fitlerObj,
    //   };
    // }

    if (sort) {
      if (!isArray(sort)) {
        sort = [sort];
      }
      sort.forEach((v) => {
        const [key, value] = v.split(':');
        sortObj[key] = Number(value) || value;
      });
    }

    if ($in) {
      if (!isArray($in)) {
        $in = [$in];
      }
      const tags = [];
      const status = [];
      $in.forEach((v) => {
        const [key, value] = v.split(':');
        if (key === 'category') {
          fitlerObj['category'] = value;
        } else if (key === 'tag' || key === 'tags') {
          tags.push(value);
        } else if (key === 'status') {
          const num = Number(value);
          !Number.isNaN(num) && status.push(num);
        }
      });

      if (tags.length > 0) {
        fitlerObj['tags'] ||= {};
        fitlerObj['tags']['$in'] = tags;
      }
      if (status.length > 0) {
        fitlerObj['status'] ||= {};
        fitlerObj['status']['$in'] = status;
      }
    }

    if ($nin) {
      if (!isArray($nin)) {
        $nin = [$nin];
      }
      const tags = [];
      const status = [];
      $nin.forEach((v) => {
        const [key, value] = v.split(':');
        if (key === 'category') {
          fitlerObj['category'] = value;
        } else if (key === 'tag' || key === 'tags') {
          tags.push(value);
        } else if (key === 'status') {
          const num = Number(value);
          !Number.isNaN(num) && status.push(num);
        }
      });

      if (tags.length > 0) {
        fitlerObj['tags'] = { $nin: tags };
      }
      if (status.length > 0) {
        fitlerObj['status'] = { $nin: status };
      }
    }

    return {
      page,
      size,
      sort: sortObj,
      filter: fitlerObj,
    };
  }

  async findAll(query: any, user?: MgReUserType) {
    const { page, size, sort, filter } = this.findAllHandleQuery(query, user);

    const [articles, count] = await Promise.all([
      page && size
        ? this.articleModel
            .find(filter)
            .sort({
              isTop: -1,
              createdAt: -1,
              ...sort,
            })
            .skip((page - 1) * size)
            .limit(size)
        : this.articleModel.find().sort({
            createdAt: -1,
          }),
      this.articleModel.countDocuments(filter),
    ]);

    articles.forEach((article) => {
      article.content = article.content.substring(0, 168);
    });

    return {
      list: articles,
      totalPage: size ? Math.ceil(count / size) : 1,
      total: count,
      curPage: page || 1,
      pageSize: size,
    };
  }

  async findOne(id: string, user: MgReUserType) {
    const article = await this.articleModel.findOne({ _id: id });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    if (article.status === ArticleStatusEnum.DELETED) {
      throw new ResponseException('文章已删除', 1005);
    }

    const content = article.content;
    article.content = '';

    switch (article.visibility) {
      case ArticleVisibilityEnum.PUBLIC:
        return article;
      case ArticleVisibilityEnum.LOGIN:
        if (user && user._id) {
          return {
            ...article,
            content,
          };
        } else {
          return {
            code: 1001,
            msg: '登录后才能查看',
            result: article,
          };
        }
      case ArticleVisibilityEnum.COMMENT:
        // 查看评论
        if (user && user._id) {
          return {
            ...article,
            content,
          };
        } else {
          return {
            code: 1002,
            msg: '评论后才能查看',
            result: article,
          };
        }
      case ArticleVisibilityEnum.PRIVATE:
        if (user && user._id === article.author) {
          return {
            ...article,
            content,
          };
        } else {
          return {
            code: 1003,
            msg: '文章为私有文章',
            result: article,
          };
        }
      default:
        throw new ResponseException('没有权限', 1004);
    }
  }

  async findById(id: string) {
    return this.articleModel.findById(id);
  }

  async findAllByUserId(userId: string, page = 1, size = 20) {
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
      .find({ author: userId })
      .skip((page - 1) * size)
      .limit(size);
  }

  async getNumsByKey(
    docs: LeanDocument<any & { _id: any }>[],
    key: 'category' | 'tags' = 'category',
  ) {
    const nums = await Promise.all(
      key === 'tags'
        ? docs.map((doc) =>
            this.articleModel.countDocuments({ tags: { $in: doc.name } }),
          )
        : docs.map((doc) =>
            this.articleModel.countDocuments({ category: doc.name }),
          ),
    );
    return nums.map((num, index) => {
      const doc: any = docs[index];
      doc.num = num;
      return doc;
    });
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    user: MgReUserType | boolean,
  ) {
    if (isBoolean(user)) {
      if (user === true) {
        return this.articleModel.findByIdAndUpdate(
          { _id: id },
          updateArticleDto,
        );
      }
      throw new ResponseException('没有权限', 1004);
    } else {
      if (user.roles.includes(Role.Admin)) {
        return this.articleModel.findByIdAndUpdate(
          { _id: id },
          updateArticleDto,
        );
      }
      if (user._id.toString() !== id) {
        throw new ResponseException('没有权限', 1004);
      }
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
      tag: name,
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

  async remove(id: string) {
    const article = await this.articleModel.findByIdAndDelete(id);

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    // 删除文章时，删除评论
    this.commentsService.removeByArticleId(id);

    // 删除文章时，删除标签
    const { tags = [] } = article;
    const tagDocs = await Promise.all(
      tags.map((tag) => this.findAllByTag(tag)),
    );
    const deleteTags = [];
    tagDocs.forEach((doc) => {
      if (doc.total <= 0) {
        deleteTags.push(doc.tag);
      }
    });

    // 删除标签
    await this.tagsService.removeMany(deleteTags);
    return article;
  }
}

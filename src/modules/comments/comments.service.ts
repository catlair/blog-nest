import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsTypeEnum } from 'src/enums/comments.enums';
import { ArticlesService } from '../articles/articles.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentDocument, Comment } from './schemas/comment.schema';
import { genObjectId } from '@/utils/mongo';
import { isEmpty } from '@/utils/is';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @Inject(forwardRef(() => ArticlesService))
    private readonly articlesService: ArticlesService,
  ) {}
  create(createCommentDto: CreateCommentDto) {
    createCommentDto.aid = genObjectId(
      createCommentDto.aid,
    ) as unknown as string;
    const pid = createCommentDto.pid,
      rid = createCommentDto.rid;
    delete createCommentDto.pid;
    delete createCommentDto.rid;
    switch (createCommentDto.type) {
      case CommentsTypeEnum.COMMENT:
        break;
      case CommentsTypeEnum.BLOG_COMMENT:
        break;
      case CommentsTypeEnum.REPLY:
        createCommentDto.pid = genObjectId(pid) as unknown as string;
        break;
      case CommentsTypeEnum.REPLY_REPLY:
        createCommentDto.pid = genObjectId(pid) as unknown as string;
        createCommentDto.rid = genObjectId(rid) as unknown as string;
        break;
      default:
        break;
    }

    return this.commentModel.create(createCommentDto);
  }

  async findArticle(id: string, page = 1, size = 20) {
    const articleUser = await this.articlesService.findUser(id);
    // 用户字段
    const userFields = {
      _id: 1,
      nickname: 1,
      avatar: 1,
      author: 1,
    };
    // 输出字段
    const outFields = {
      _id: 1,
      content: 1,
      createdAt: 1,
      user: userFields,
    };
    const comments = await this.commentModel
      .aggregate()
      .match({
        aid: genObjectId(id),
        type: CommentsTypeEnum.COMMENT,
      })
      .skip((page - 1) * size)
      .limit(size)
      // 评论的人
      .lookup({
        from: 'users',
        let: { user: '$user' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$user'],
              },
            },
          },
          {
            $addFields: {
              author: {
                $eq: ['$_id', articleUser],
              },
            },
          },
        ],
        as: 'user',
      })
      // 评论的回复
      .lookup({
        from: 'comments',
        localField: '_id',
        foreignField: 'pid',
        as: 'children',
      })
      .unwind({
        path: '$children',
        preserveNullAndEmptyArrays: true,
      })
      // 评论的回复是谁发的
      .lookup({
        from: 'users',
        as: 'children.user',
        let: { user: '$children.user' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$_id', '$$user'],
              },
            },
          },
          {
            $addFields: {
              author: {
                $eq: ['$_id', articleUser],
              },
            },
          },
        ],
      })
      // 回复的谁
      .lookup({
        from: 'users',
        localField: 'children.rid',
        foreignField: '_id',
        as: 'children.reply',
      })
      .group({
        _id: '$_id',
        content: { $first: '$content' },
        createdAt: { $first: '$createdAt' },
        user: {
          $first: {
            $first: '$user',
          },
        },
        children: {
          $push: {
            _id: '$children._id',
            content: '$children.content',
            createdAt: '$children.createdAt',
            user: { $first: '$children.user' },
            reply: { $first: '$children.reply' },
          },
        },
      })
      .project({
        ...outFields,
        children: {
          ...outFields,
          reply: userFields,
        },
      });

    return comments
      .map((comment) => {
        if (comment.children) {
          if (isEmpty(comment.children[0])) {
            comment.children = [];
          }
        }
        return comment;
      })
      .sort((a, b) => {
        // 时间倒序
        return b.createdAt - a.createdAt;
      });
  }

  private async find(id: any, { page = 1, size = 20 }, type: CommentsTypeEnum) {
    page ||= 1;
    size ||= 20;

    if (size > 50) {
      throw new BadRequestException('ps 最大值为 50');
    }

    let idKey = 'aid';
    switch (type) {
      case CommentsTypeEnum.BLOG_COMMENT:
        idKey = 'bid';
        break;
      case CommentsTypeEnum.REPLY:
        idKey = 'pid';
        break;
      default:
        break;
    }

    const [comments, count] = await Promise.all([
      this.commentModel
        .find({
          type,
          [idKey]: id,
        })
        .skip((page - 1) * size)
        .limit(size),
      this.commentModel.countDocuments({
        type,
        [idKey]: id,
      }),
    ]);

    return {
      list: comments,
      totalPage: Math.ceil(count / size),
      total: count,
      curPage: page,
    };
  }

  async findReply(id: string, page: number, size: number) {
    return await this.find(id, { page, size }, CommentsTypeEnum.REPLY);
  }

  async findBlogComment(id: number, page: number, size: number) {
    return await this.find(id, { page, size }, CommentsTypeEnum.BLOG_COMMENT);
  }

  async removeByArticleId(id: string): Promise<any> {
    return this.commentModel.deleteMany({ aid: id });
  }

  remove(id: string) {
    return this.commentModel.findByIdAndRemove(id);
  }
}

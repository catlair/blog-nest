import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentsTypeEnum } from 'src/enums/comments.enums';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentDocument, Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  create(createCommentDto: CreateCommentDto) {
    const id = createCommentDto.pid;
    delete createCommentDto.pid;
    switch (createCommentDto.type) {
      case CommentsTypeEnum.COMMENT:
        createCommentDto.aid = id as string;
        break;
      case CommentsTypeEnum.BLOG_COMMENT:
        createCommentDto.bid = id as number;
        break;
      case CommentsTypeEnum.COMMENT:
        createCommentDto.pid = id as string;
        break;
      default:
        break;
    }

    return this.commentModel.create(createCommentDto);
  }

  async findArticle(id: string, page = 1, size = 20) {
    return await this.find(id, { page, size }, CommentsTypeEnum.COMMENT);
  }

  async find(id: any, { page = 1, size = 20 }, type: CommentsTypeEnum) {
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
          type: CommentsTypeEnum.REPLY,
          [idKey]: id,
        })
        .skip((page - 1) * size)
        .limit(size),
      this.commentModel.countDocuments({
        type: CommentsTypeEnum.REPLY,
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

  remove(id: string) {
    return this.commentModel.findByIdAndRemove(id);
  }
}

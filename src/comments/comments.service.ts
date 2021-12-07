import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentDocument, Comment } from './schemas/comment.schema';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  create(createCommentDto: CreateCommentDto) {
    return this.commentModel.create(createCommentDto);
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

    return await this.commentModel
      .find({})
      .skip((page - 1) * size)
      .limit(size);
  }

  findOne(id: string) {
    return this.commentModel.findById(id);
  }

  remove(id: string) {
    return this.commentModel.findByIdAndRemove(id);
  }
}

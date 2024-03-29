import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';
import { CommentsTypeEnum } from '@/enums/comments.enums';

// 导出评论文档
export type CommentDocument = Comment & Document;

// 评论
@Schema({
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Comment {
  // 评论内容
  @Prop({ required: true, maxlength: 100 })
  content: string;

  // 父 id
  @Prop({ ref: 'Comment', type: Types.ObjectId })
  pid: string;

  // 页面 id （当且仅当 type = 2）
  @Prop()
  bid: number;

  // 文章 id （当且仅当 type = 0）
  @Prop({ ref: 'Article', type: Types.ObjectId })
  aid: string;

  // 评论还是回复
  @Prop({
    required: true,
    enum: CommentsTypeEnum,
    default: CommentsTypeEnum.COMMENT,
  })
  type: number;

  @Prop({ ref: 'Comment', type: Types.ObjectId })
  reply: Comment;

  @Prop({ ref: 'User', type: Types.ObjectId })
  rid: User;

  // 评论者
  @Prop({ ref: 'User', type: Types.ObjectId })
  user: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

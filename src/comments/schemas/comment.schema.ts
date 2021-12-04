import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { Document } from 'mongoose';

// 导出评论文档
export type CommentDocument = Comment & Document;

// 评论
@Schema()
export class Comment {
  // 评论内容
  @Prop({ required: true, maxlength: 100 })
  content: string;

  // 评论时间
  @Prop({ required: true, default: Date.now })
  @IsDate()
  createTime: Date;

  // 父评论
  @Prop({ ref: 'Comment' })
  parent: string;

  // 评论者
  @Prop({ required: true, ref: 'User' })
  user: string;

  // 评论的文章
  @Prop({ required: true, ref: 'Article' })
  article: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

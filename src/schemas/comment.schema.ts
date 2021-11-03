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
  @Prop({ required: true, ref: 'Comment' })
  parent: string;

  // 分类
  @Prop({ required: true, ref: 'Category' })
  category: string;
}

export const CategorySchema = SchemaFactory.createForClass(Comment);

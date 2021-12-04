import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsDate } from 'class-validator';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

// 文章
@Schema()
export class Article {
  // 标题
  @Prop({ required: true, maxlength: 100 })
  title: string;

  // 内容
  @Prop({ required: true, maxlength: 2000 })
  content: string;

  // 创建时间
  @Prop({ required: true, default: Date.now })
  @IsDate()
  createTime: Date;

  // 更新时间
  @Prop({ required: true, default: Date.now })
  @IsDate()
  updateTime: Date;

  // 分类
  @Prop({ required: true, ref: 'Category' })
  category: string;

  // 标签
  @Prop({ required: true, ref: 'Tag' })
  tags: string[];
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

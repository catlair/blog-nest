import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {
  ArticleStatusEnum,
  ArticleVisibilityEnum,
} from '../../../enums/article-status.enums';

export type ArticleDocument = Article & mongoose.Document;

// 文章
@Schema({
  timestamps: true,
})
export class Article {
  // 标题
  @Prop({ required: true, maxlength: 100 })
  title: string;

  // 内容
  @Prop({ required: true, maxlength: 2000 })
  content: string;

  // 作者
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  // 这里暂时不知道，按照官网会报错
  author: any;

  // 分类
  @Prop({ required: true, ref: 'Category' })
  category: string;

  // 标签
  @Prop({ required: true, ref: 'Tag' })
  tags: string[];

  // 可见性
  @Prop({ enum: ArticleVisibilityEnum, default: ArticleVisibilityEnum.PUBLIC })
  visibility: number;

  // 状态  0: 草稿 1: 已发布 2: 已删除 3: 未发布
  @Prop({ enum: ArticleStatusEnum, default: ArticleStatusEnum.DRAFT })
  status: number;

  // 置顶
  @Prop({ default: false })
  isTop: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

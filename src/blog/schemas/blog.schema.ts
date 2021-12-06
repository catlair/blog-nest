import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

export type BlogLinks = {
  name: string;
  url: string;
  icon?: string;
};

// 站点信息
@Schema()
export class Blog {
  // 博客标题
  @Prop()
  title: string;

  // 博客简介
  @Prop()
  desc: string;

  // 作者
  @Prop()
  author: string;

  // 头像
  @Prop()
  avatar: string;

  // 作者简介
  @Prop()
  authorDesc: string;

  // 关于
  @Prop()
  about: string;

  // 创建时间
  @Prop({ default: Date.now })
  createTime: Date;

  // 公告
  @Prop()
  notice: string;

  // 外链
  @Prop()
  links: Array<BlogLinks>;
}

// 导出模型
export const BlogSchema = SchemaFactory.createForClass(Blog);

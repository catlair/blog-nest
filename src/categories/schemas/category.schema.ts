import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Document & Category;

// 分类
@Schema()
export class Category {
  // 分类名称
  @Prop({ required: true, maxlength: 20, unique: true })
  name: string;

  // 分类描述
  @Prop({ maxlength: 100 })
  description: string;

  // 分类颜色
  @Prop({ maxlength: 7, default: '#ffffff' })
  color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Document & Category;

// 分类
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: false,
  },
})
export class Category {
  // 分类名称
  @Prop({ required: true, maxlength: 20, unique: true })
  name: string;

  // 分类颜色
  @Prop({ maxlength: 25, default: 'rgba(0, 0, 0, 0.5)' })
  color: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

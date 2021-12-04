import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// 导出标签文档类型
export type TagDocument = Tag & Document;

// 标签模型
@Schema()
export class Tag {
  // 标签名
  @Prop({ required: true, maxlength: 20, unique: true })
  name: string;
}

// 导出模型
export const TagSchema = SchemaFactory.createForClass(Tag);

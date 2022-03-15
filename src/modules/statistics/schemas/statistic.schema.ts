import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type StatisticDocument = Statistic & mongoose.Document;

// 访问量
@Schema()
export class Statistic {
  // 游客
  @Prop({ required: true, default: 0 })
  uv: number;

  // 登录用户
  @Prop({ required: true, default: 0 })
  uvLogin: number;

  // 访问次数
  @Prop({ required: true, default: 0 })
  pv: number;
}

export const StatisticSchema = SchemaFactory.createForClass(Statistic);

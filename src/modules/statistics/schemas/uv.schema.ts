import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type StatisticUVDocument = StatisticUV & mongoose.Document;

@Schema({
  timestamps: {
    // 首次访问时间
    createdAt: 'firstAccessAt',
    // 最后访问时间
    updatedAt: 'lastAccessAt',
  },
})
export class StatisticUV {
  // 是否登录
  @Prop({ required: true, default: false })
  isLogin: boolean;

  // UA
  @Prop({ required: true, default: '' })
  ua: string;

  // IP
  @Prop({ required: true, default: '' })
  ip: string;

  // 城市
  @Prop({ required: true, default: '' })
  city: string;

  // 用户 ID (登录用户)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: '' })
  user: string;

  // 访问次数
  @Prop({ required: true, default: 0 })
  pv: number;
}

export const StatisticUVSchema = SchemaFactory.createForClass(StatisticUV);

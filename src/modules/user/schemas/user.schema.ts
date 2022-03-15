import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '@/enums/role.enum';

export type UserDocument = User & Document;

// 用户
@Schema({
  timestamps: true,
})
export class User {
  // 账号名
  @Prop({ required: true, unique: true, maxlength: 12, minlength: 3 })
  username: string;

  // 密码
  @Prop({ required: true, maxlength: 80, minlength: 50, select: false })
  password: string;

  // 昵称
  @Prop({ required: true, maxlength: 20 })
  nickname: string;

  // 邮箱
  @Prop({ required: true, unique: true })
  email: string;

  // 博客地址
  @Prop({ maxlength: 200 })
  blog: string;

  // 头像地址
  @Prop({ maxlength: 200 })
  avatar: string;

  // 拥有的权限
  @Prop()
  roles: Role[];

  // 个人简介
  @Prop({ maxlength: 200 })
  description: string;

  // 最后登录时间
  @Prop({ default: Date.now })
  lastLoginAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

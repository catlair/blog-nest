import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsUrl } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

// 用户
@Schema()
export class User {
  // 账号名
  @Prop({ required: true, unique: true, maxlength: 20, minlength: 4 })
  username: string;

  // 密码
  @Prop({ required: true, maxlength: 20, minlength: 6 })
  password: string;

  // 昵称
  @Prop({ required: true, unique: true, maxlength: 20, minlength: 4 })
  nickname: string;

  // 邮箱
  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  // 博客地址
  @Prop({ maxlength: 200 })
  @IsUrl()
  blog: string;

  // 拥有的权限
  @Prop({ required: true })
  permissions: string[];

  // 个人简介
  @Prop({ maxlength: 200 })
  description: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

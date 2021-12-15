import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { BlogLinks } from '../schemas/blog.schema';

export class UpdateBlogDto {
  // 博客标题
  title: string;

  // 博客简介
  desc: string;

  // 作者
  author: string;

  // 头像
  @ApiProperty({ description: '头像', example: 'https://baidu.com' })
  @IsUrl({}, { message: '头像地址不合法' })
  avatar: string;

  // 作者简介
  authorDesc: string;

  // 关于
  about: string;

  // 创建时间
  createTime: Date;

  // 公告
  notice: string;

  // 外链
  links: Array<BlogLinks>;
}

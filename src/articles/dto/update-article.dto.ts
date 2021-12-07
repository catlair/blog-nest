import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsObjectId } from '../../validation';
import { CreateArticleDto } from './create-article.dto';
import * as mongoose from 'mongoose';
import { IsDateString } from 'class-validator';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {
  // 创建时间
  @IsDateString({ message: '创建时间格式不正确' })
  createdAt?: Date;

  // 作者
  @ApiProperty({ description: '作者' })
  @IsObjectId({ message: '作者 Id 不合法' })
  author: mongoose.Types.ObjectId;
}

import { IsDefined, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArticleStatusEnum,
  ArticleVisibilityEnum,
} from '../../enums/article-status.enums';

export class CreateArticleDto {
  // 标题
  @IsDefined({ message: '标题不能为空' })
  @ApiProperty({ description: '标题', example: '标题1' })
  title: string;

  // 内容
  @IsDefined({ message: '内容不能为空' })
  @ApiProperty({ description: '内容', example: '内容1' })
  content: string;

  // 分类
  @ApiProperty({ description: '分类', example: '默认分类' })
  category: string;

  // 标签
  @ApiProperty({ description: '标签', example: ['默认标签'] })
  tags: string[];

  // 状态  0: 草稿 1: 已发布 2: 已删除 3: 未发布
  @ApiProperty({ description: '状态', example: 1 })
  @IsEnum(ArticleStatusEnum, { message: '无法识别的 status' })
  status: number;

  // 可见性
  @ApiProperty({ description: '可见性', example: 0 })
  @IsEnum(ArticleVisibilityEnum, { message: '无法识别的 visibility' })
  visibility: number;

  // 是否置顶
  @ApiProperty({ description: '是否置顶', example: false })
  isTop: boolean;
}

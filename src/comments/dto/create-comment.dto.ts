// 详细说明：
// type 决定评论类型
// 如果是评论，则父 id 为文章 id 。如果是回复，则父 id 为评论 id
// 当 type 为 2 时，bid 为必填，pid 无效

import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { CommentsTypeEnum } from 'src/enums/comments.enums';
import { IsObjectId } from 'src/validation';

export class CreateCommentDto {
  // 评论内容
  @IsString({ message: '评论内容必须为字符串' })
  @Length(2, 200, { message: '评论内容长度必须在2-200之间' })
  @IsDefined({ message: '评论内容不能为空' })
  @ApiProperty({ description: '评论内容', example: '评论内容' })
  content: string;

  // 父 id
  @ValidateIf((o) => o.type === CommentsTypeEnum.REPLY)
  @IsObjectId({ message: '父 id 必须为 ObjectId' })
  @IsDefined({ message: '父 id 不能为空' })
  @ApiProperty({ description: '父 id', example: '61addb21a119fbf4a70f6b41' })
  pid: string;

  // 文章 id
  @ValidateIf((o) => o.type === CommentsTypeEnum.COMMENT)
  @IsObjectId({ message: '文章 id 必须为 ObjectId' })
  @IsDefined({ message: '文章 id 不能为空' })
  @ApiProperty({ description: '文章 id', example: '61addb21a119fba4a70f6b41' })
  aid: string;

  // 页面 id
  @ValidateIf((o) => o.type === CommentsTypeEnum.BLOG_COMMENT)
  @IsNumber({}, { message: '页面 id 必须为数字' })
  @IsDefined({ message: '页面 id 不能为空' })
  @ApiProperty({ description: '页面 id', example: 1 })
  bid: number;

  // 评论还是回复
  @IsEnum(CommentsTypeEnum, { message: 'type 类型非法' })
  @IsDefined({ message: 'type 类型不能为空' })
  @ApiProperty({ description: '评论类型', example: 1 })
  type: number;

  // 评论者
  @IsObjectId({ message: '评论者 id 必须为 ObjectId' })
  @IsDefined({ message: '评论者 id 必须存在' })
  @ApiProperty({
    description: '评论者 id',
    example: '61addb21a119fba4a70f6b41',
  })
  user: string;
}

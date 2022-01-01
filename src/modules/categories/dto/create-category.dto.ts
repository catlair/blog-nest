import { IsRgbColor } from '@/validation/IsRgbColor';
import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateCategoryDto {
  // 分类名称
  @IsDefined({ message: '分类名称不能为空' })
  @IsString({ message: '分类名称必须为字符串' })
  @ApiProperty({ description: '分类名称', example: '分类名称' })
  name: string;

  // 分类颜色
  @IsRgbColor(true, { message: '颜色格式不正确' })
  @ApiProperty({ description: '分类颜色' })
  color: string;
}

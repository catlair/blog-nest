import { IsNumberString, Contains } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageSizeQueryDto {
  // 页数
  @ApiProperty({
    description: '页数',
    example: 1,
    required: false,
  })
  @IsNumberString()
  pn: number;

  // 每页数量
  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false,
  })
  @IsNumberString()
  ps: number;

  @ApiProperty({
    description: '排序字段',
    example: 'createdAt:-1',
    required: false,
  })
  @Contains(':', { each: true })
  sort: string;

  @ApiProperty({
    description: '查询字段',
    example: 'name:test',
    required: false,
  })
  @Contains(':', { each: true })
  $in: string;

  @ApiProperty({
    description: '查询字段',
    example: 'name:test',
    required: false,
  })
  @Contains(':', { each: true })
  $nin: string;
}

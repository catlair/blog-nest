import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PageSizeQueryDto {
  // 页数
  @ApiProperty({
    description: '页数',
    example: 1,
  })
  @IsNumberString()
  pn: string;

  // 每页数量
  @ApiProperty({
    description: '每页数量',
    example: 10,
  })
  @IsNumberString()
  ps: string;
}

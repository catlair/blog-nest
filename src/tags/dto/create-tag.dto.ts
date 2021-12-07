import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class CreateTagDto {
  @Length(1, 20, { message: '标签名称长度不能超过20' })
  @ApiProperty({ description: '标签名称', example: 'vue' })
  name: string;
}

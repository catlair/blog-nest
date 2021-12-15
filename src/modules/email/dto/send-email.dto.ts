import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty({
    description: '邮箱',
    example: 'catlair@qq.com',
  })
  to: string;
}

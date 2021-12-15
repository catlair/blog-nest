import { IsBoolean, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserLength } from '../../../validation';

export class LoginUserDto {
  @ApiProperty({ example: false })
  @IsBoolean()
  isEmail?: boolean;

  @IsString({ message: '用户名/邮箱必须是字符串' })
  @UserLength(
    { username: [2, 12], email: [6, 30] },
    { message: '用户名/邮箱长度不符合' },
  )
  @ApiProperty({ example: 'admin' })
  username: string;

  @IsString({ message: '密码必须是字符串' })
  @Length(1, 20, { message: '密码长度必须在6-20之间' })
  @ApiProperty({ example: '123456', maxLength: 20, minLength: 6 })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';
import { UserLength } from 'src/validation';

export class ResetPassDto {
  @IsEmail()
  @ApiProperty({ example: 'catlair@qq.com' })
  email: string;

  @ApiProperty({ example: '111111' })
  @IsNumberString()
  @Length(6, 6, { message: '验证码长度不正确' })
  code: string;

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

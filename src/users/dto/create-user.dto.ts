import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUrl, IsArray, IsDefined } from 'class-validator';

export class CreateUserDto {
  // 用户名
  @IsString({
    message: '用户名必须是字符串',
  })
  @IsDefined({
    message: '用户名不能为空',
  })
  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  // 密码
  @IsString({
    message: '密码必须是字符串',
  })
  @IsDefined({
    message: '密码不能为空',
  })
  @ApiProperty({ description: '密码', example: '123456' })
  password: string;

  // 昵称
  @IsString({
    message: '昵称必须是字符串',
  })
  @ApiProperty({ description: '昵称', example: '管理员', required: false })
  nickname: string;

  // 邮箱
  @IsEmail({
    message: '邮箱格式不正确',
  })
  @IsDefined({
    message: '邮箱不能为空',
  })
  @ApiProperty({ description: '邮箱', example: 'demo@gmail.com' })
  email: string;

  // 博客地址
  @IsUrl({}, { message: '博客地址格式不正确' })
  @ApiProperty({
    description: '博客地址',
    example: 'https://www.baidu.com',
    required: false,
  })
  blog: string;

  // 头像地址
  @IsUrl({}, { message: '头像地址格式不正确' })
  @ApiProperty({
    description: '头像地址',
    example: 'https://www.baidu.com',
    required: false,
  })
  avatar: string;

  // 拥有的权限
  @IsArray({ message: '权限必须是数组' })
  @ApiProperty({
    description: '拥有的权限',
    example: ['admin'],
    required: false,
  })
  roles: string[];

  // 个人简介
  @IsString({ message: '个人简介必须是字符串' })
  @ApiProperty({
    description: '个人简介',
    example: '这是一个简介',
    required: false,
  })
  description: string;
}

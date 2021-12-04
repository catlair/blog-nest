import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsUrl, IsArray } from 'class-validator';

export class CreateUserDto {
  // 用户名
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '用户名', example: 'admin' })
  username: string;

  // 密码
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '密码', example: '123456' })
  password: string;

  // 昵称
  @IsString()
  @ApiProperty({ description: '昵称', example: '管理员', required: false })
  nickname: string;

  // 邮箱
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '邮箱', example: 'demo@gmail.com' })
  email: string;

  // 博客地址
  @IsString()
  @IsUrl()
  @ApiProperty({
    description: '博客地址',
    example: 'https://www.baidu.com',
    required: false,
  })
  blog: string;

  // 头像地址
  @IsString()
  @IsUrl()
  @ApiProperty({
    description: '头像地址',
    example: 'https://www.baidu.com',
    required: false,
  })
  avatar: string;

  // 拥有的权限
  @IsArray()
  @ApiProperty({
    description: '拥有的权限',
    example: ['admin'],
    required: false,
  })
  permissions: string[];

  // 个人简介
  @IsString()
  @ApiProperty({
    description: '个人简介',
    example: '这是一个简介',
    required: false,
  })
  description: string;
}

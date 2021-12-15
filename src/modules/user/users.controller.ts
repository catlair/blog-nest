import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth, AuthUnlogin, UserReq } from '../../decorators';
import { Role } from '../../enums/role.enum';
import type { MgReType } from '@/types';
import { User } from './schemas/user.schema';
import { PageSizeQueryDto } from '../../common/dto/pagesize-query.dto';

@Controller('user')
@ApiTags('用户')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @AuthUnlogin()
  create(@Body() createUserDto: CreateUserDto, @UserReq() user: any) {
    if (user?.role === Role.Admin) {
      return this.usersService.create(createUserDto);
    }
    createUserDto.roles = [Role.User];
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(Role.Admin)
  @ApiOperation({ summary: '查找所有用户' })
  async findAll(@Query('pn') page: string, @Query('ps') size: string) {
    return await this.usersService.findAll(+page, +size);
  }

  @Get('me')
  @ApiOperation({ summary: '获取用户信息' })
  @Auth()
  findMe(@UserReq() user: MgReType<User>) {
    return this.usersService.find({ _id: user._id });
  }

  @Get(':id/articles')
  @ApiOperation({ summary: '查找用户信息含文章' })
  findArticles(@Param('id') id: string, @Query() query: PageSizeQueryDto) {
    return this.usersService.findArticle(id, +query.pn, +query.ps);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  @Auth(Role.Admin)
  findUser(@Param('id') id: string) {
    return this.usersService.find({ _id: id });
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UserReq() user: MgReType<User>,
  ) {
    console.log(id, user);

    if (user?.roles.includes(Role.Admin)) {
      return this.usersService.update(id, updateUserDto);
    } else if (user._id.toString() === id) {
      // 无权限修改自己的权限信息
      delete updateUserDto.roles;
      return this.usersService.update(id, updateUserDto);
    }
    throw new ForbiddenException('权限不足');
  }

  @Delete(':id')
  @Auth(Role.Admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

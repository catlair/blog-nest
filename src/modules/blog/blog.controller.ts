import { Controller, Get, Body, Put, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Auth } from '../../decorators';
import { Role } from '../../enums/role.enum';

@Controller('blog')
@ApiTags('博客站点信息')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @Auth(Role.Admin)
  async create(@Body() updateBlogDto: UpdateBlogDto) {
    const info = await this.findOne();

    if (info) {
      return await this.update(updateBlogDto);
    }
    return await this.blogService.create(updateBlogDto);
  }

  @Get()
  async findOne() {
    return await this.blogService.findOne();
  }

  @Put()
  @Auth(Role.Admin)
  async update(@Body() updateBlogDto: UpdateBlogDto) {
    return await this.blogService.update(updateBlogDto);
  }
}

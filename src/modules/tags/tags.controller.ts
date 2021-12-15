import { Controller, Get, Param } from '@nestjs/common';
import { TagsService } from './tags.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('tag')
@ApiTags('标签')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  @ApiOperation({ summary: '获取所有标签' })
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '根据标签 id 获取所有文章' })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }
}

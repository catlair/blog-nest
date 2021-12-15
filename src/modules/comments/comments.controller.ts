import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageSizeQueryDto } from '../../common/dto/pagesize-query.dto';
import { Auth, UserReq } from 'src/decorators';
import { Role } from 'src/enums/role.enum';
import type { MgReUserType } from '@/types';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
@ApiTags('评论')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Auth()
  create(
    @Body() createCommentDto: CreateCommentDto,
    @UserReq() user: MgReUserType,
  ) {
    createCommentDto.userId = user._id;
    return this.commentsService.create(createCommentDto);
  }

  @Get('reply/:id')
  @ApiOperation({ summary: '获取评论下的回复' })
  findReply(@Param('id') id: string, @Query() query: PageSizeQueryDto) {
    return this.commentsService.findReply(id, +query.pn, +query.ps);
  }

  @Get('blog/:id')
  @ApiOperation({ summary: '获取博客页面的评论' })
  findBlogComment(
    @Param('id', new ParseIntPipe()) id: number,
    @Query() query: PageSizeQueryDto,
  ) {
    return this.commentsService.findBlogComment(id, +query.pn, +query.ps);
  }

  @Get('article/:id')
  @ApiOperation({ summary: '获取文章的评论' })
  async findArticle(@Param('id') id: string, @Query() query: PageSizeQueryDto) {
    return await this.commentsService.findArticle(id, +query.pn, +query.ps);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string, @UserReq() user: MgReUserType) {
    if (user._id.toString() === id || user.roles.includes(Role.Admin)) {
      return this.commentsService.remove(id);
    }
    throw new BadRequestException();
  }
}

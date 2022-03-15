import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Auth, AuthUnlogin, UserReq } from '@/decorators';
import { Role } from '@/enums/role.enum';
import type { MgReUserType } from '@/types';
import { ArticleStatusEnum } from '@/enums/article-status.enums';
import { ResponseException } from '@/exception';
import { PageSizeQueryDto } from '@/common/dto/pagesize-query.dto';
import { genObjectId, stringEquals } from '@/utils/mongo';

@Controller('article')
@ApiTags('文章')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @Auth(Role.Author)
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @UserReq() user: MgReUserType,
  ) {
    createArticleDto.author = user._id;
    // Author 才有权限发布文章
    if (!user.roles.includes(Role.Author)) {
      createArticleDto.status = ArticleStatusEnum.DRAFT;
    }
    return await this.articlesService.create(createArticleDto);
  }

  @Get()
  @AuthUnlogin()
  async findAll(
    @Query() query: PageSizeQueryDto,
    @UserReq() user: MgReUserType,
  ) {
    return await this.articlesService.findAll(query, user);
  }

  @Get(':id')
  @AuthUnlogin()
  findOne(@Param('id') id: string, @UserReq() user: MgReUserType) {
    return this.articlesService.findOne(id, user);
  }

  @Patch(':id')
  @Auth(Role.Author)
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @UserReq() user: MgReUserType,
  ): Promise<any> {
    return this.articlesService.update(id, updateArticleDto, user);
  }

  @Delete(':id')
  @Auth(Role.Author)
  remove(@Param('id') id: string, @UserReq() user: MgReUserType) {
    if (
      (user.roles && user.roles.includes(Role.Admin)) ||
      stringEquals(user._id, id)
    ) {
      return this.articlesService.remove(id);
    }
    throw new ResponseException('没有权限删除文章');
  }
}

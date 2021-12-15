import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog, BlogDocument } from './schemas/blog.schema';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(updateBlogDto: UpdateBlogDto) {
    return await this.blogModel.create(updateBlogDto);
  }

  async findOne() {
    const blog = await this.blogModel.find();
    return blog[0];
  }

  async update(updateBlogDto: UpdateBlogDto): Promise<any> {
    return await this.blogModel.updateOne({}, updateBlogDto);
  }
}

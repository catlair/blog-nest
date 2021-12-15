import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserValidationEnum } from '../../enums/user-validation.enums';
import { ArticlesService } from '../articles/articles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly articlesService: ArticlesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userModel.create(createUserDto);
      if (user) {
        return user;
      }
    } catch (error) {
      if (error.code === 11000) {
        const key = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(`${UserValidationEnum[key]}已经存在`);
      }
      throw error;
    }
  }

  async findAll(page: number, size: number) {
    if (!page) {
      throw new BadRequestException('缺少参数 pn');
    }
    if (!size) {
      throw new BadRequestException('缺少参数 ps');
    }

    if (size > 50) {
      throw new BadRequestException('ps 最大值为 50');
    }

    const [users, count] = await Promise.all([
      this.userModel
        .find({})
        .skip((page - 1) * size)
        .limit(size),
      this.userModel.countDocuments(),
    ]);

    return {
      list: users,
      totalPage: Math.ceil(count / size),
      total: count,
      curPage: page,
    };
  }

  findOne(id: string, username?: string) {
    return this.userModel.find({ _id: id, username });
  }

  async findArticle(id: string, page: number, size: number) {
    return this.articlesService.findAllByUserId(id, page, size);
  }

  find(playload: any) {
    return this.userModel.findOne(playload);
  }

  findOneByName(username: string) {
    return this.userModel.findOne({ username });
  }

  update(id: string, updateUserDto: UpdateUserDto): any {
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: string): any {
    return this.userModel.deleteOne({ _id: id });
  }
}

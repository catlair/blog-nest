import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserValidationEnum } from '../enums/user-validation.enums';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

    return await this.userModel
      .find({})
      .skip((page - 1) * size)
      .limit(size);
  }

  findOne(id: string) {
    return this.userModel.findOne({ _id: id });
  }

  find(playload: any) {
    return this.userModel.findOne(playload);
  }

  findOneByName(username: string) {
    return this.userModel.findOne({ username });
  }

  update(id: string, updateUserDto: UpdateUserDto): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { username, ...rest } = updateUserDto;
    return this.userModel.updateOne({ _id: id }, rest);
  }

  remove(id: string): any {
    return this.userModel.deleteOne({ _id: id });
  }
}

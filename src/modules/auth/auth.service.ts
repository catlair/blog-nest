import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';
import { MgReType } from '../../types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
    isEmail = false,
  ): Promise<Omit<MgReType<User>, 'password'>> {
    if (isEmail) {
      return await this.validateEmail(username, password);
    }
    return await this.validateUsername(username, password);
  }

  async validateEmail(email: string, password: string) {
    const user = await this.usersService.find({ email }).select('+password');

    if (user && user.password === password) {
      return user;
    }
    throw new BadRequestException('邮箱或密码错误');
  }

  async validateUsername(username: string, password: string) {
    const user = await this.usersService.find({ username }).select('+password');

    if (user && user.password === password) {
      return user;
    }
    throw new BadRequestException('用户名或密码错误');
  }

  async login(user: MgReType<User>, key: 'username' | 'email' = 'username') {
    return {
      [key]: user[key],
      id: user._id,
      access_token: this.jwtService.sign({
        [key]: user[key],
        id: user._id,
      }),
      roles: user.roles,
    };
  }
}

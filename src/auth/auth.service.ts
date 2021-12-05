import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/schemas/user.schema';
import { MgReType } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<MgReType<User>, 'password'>> {
    const user = await this.usersService
      .findOneByName(username)
      .select('+password');

    if (user && user.password === password) {
      return user;
    }
    throw new BadRequestException('用户名或密码错误');
  }

  async login(user: MgReType<User>) {
    const { username, _id } = user;

    const payload = { username, id: _id };
    return {
      username,
      access_token: this.jwtService.sign(payload),
    };
  }
}

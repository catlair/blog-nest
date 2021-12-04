import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (user && user.password === password) {
      // eslint-disable-next-line
      const { password, ...result } = user;
      return result;
    }
    throw new BadRequestException('用户名或密码错误');
  }

  async login(user: any) {
    console.log(user);

    const payload = { username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/users.service';
import { User } from '../user/schemas/user.schema';
import type { MgReType } from '@/types';
import { ResetPassDto } from './dto/reset-pass.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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

  async resetPassword(resetPassDto: ResetPassDto) {
    const user = await this.usersService.findOneByName(resetPassDto.username);

    if (!user || user.email !== resetPassDto.email) {
      throw new BadRequestException('用户不存在或邮箱错误');
    }

    const cacheCode = await this.cacheManager.get(user.email);

    if (+cacheCode === resetPassDto.code) {
      await this.usersService.update(user._id, {
        password: resetPassDto.password,
      });
      this.cacheManager.del(user.email);
      return {
        msg: '密码重置成功',
      };
    } else {
      throw new BadRequestException('验证码错误');
    }
  }
}

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
import { HashingService } from '@/utils/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly hashingService: HashingService,
  ) {}

  async validateUser(
    username: string,
    password: string,
    isEmail = false,
  ): Promise<Omit<MgReType<User>, 'password'>> {
    let options: { email?: string; username?: string },
      errMsg = '';

    if (isEmail) {
      options = { email: username };
      errMsg = '邮箱或密码错误';
    } else {
      options = { username };
      errMsg = '用户名或密码错误';
    }

    const user = await this.usersService.find(options).select('+password');
    const isMatch = await this.hashingService.match(password, user.password);
    if (user && isMatch) {
      return user;
    }
    throw new BadRequestException(errMsg);
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

    if (cacheCode === resetPassDto.code) {
      await this.usersService.update(user._id, {
        password: await this.hashingService.get(resetPassDto.password),
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

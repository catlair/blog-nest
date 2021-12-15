import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import * as path from 'path';
import { UsersService } from '../user/users.service';
import dayjs from '../../utils/dayjs';
import { ResetPassDto } from './dto/reset-pass.dto';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private usersService: UsersService,
  ) {}
  /**
   * 发送邮件验证码
   * @param email 邮件
   */
  async sendEmailCode(email: string) {
    const code = Math.random().toString().slice(-6);
    const date = dayjs.unix(Date.now() / 1000).format('YYYY-MM-DD HH:mm:ss');
    const sendMailOptions: ISendMailOptions = {
      to: email,
      subject: '用户邮箱验证',
      template: path.resolve(__dirname, './template', 'validate-code'),
      context: {
        code, //验证码
        date, //日期
      },
    };
    await this.mailerService.sendMail(sendMailOptions);
    await this.cacheManager.set(email, code, { ttl: 300 });

    return {
      msg: '验证码发送成功',
    };
  }

  async testEamilCode(resetPassDto: ResetPassDto) {
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

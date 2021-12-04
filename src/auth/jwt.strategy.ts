import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
//Strategy 这个一定是jwt中的,不要因为复制粘贴用到了local的,导致不报错但是验证失败
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Configuration } from '../config/configuration';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersService: UsersService,
    configService: ConfigService<Configuration>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    } as StrategyOptions);
  }

  async validate(user): Promise<any> {
    return await this.usersService.findOne(user.id);
  }
}

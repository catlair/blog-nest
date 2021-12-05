import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

// loacal strategy
// 用于登录

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passwordField: 'password',
      usernameField: 'username',
    } as IStrategyOptionsWithRequest);
  }

  async validate(username: string, password: string) {
    return await this.authService.validateUser(username, password);
  }
}

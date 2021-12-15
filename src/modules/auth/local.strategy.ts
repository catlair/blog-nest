import { IStrategyOptionsWithRequest, Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';

// loacal strategy
// 用于登录

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passwordField: 'password',
      usernameField: 'username',
      passReqToCallback: true,
    } as IStrategyOptionsWithRequest);
  }

  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<any> {
    const { isEmail } = req.body;
    return await this.authService.validateUser(username, password, isEmail);
  }
}

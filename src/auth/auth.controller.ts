import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MgReType } from 'src/types';
import { User } from 'src/users/schemas/user.schema';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserReq } from './decorator/users.decorator';

@Controller('auth')
@ApiTags('权限验证')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@UserReq() user: MgReType<User>) {
    return this.authService.login(user);
  }
}

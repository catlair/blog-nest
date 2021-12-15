import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { MgReType } from '@/types';
import { User } from '@/modules/user/schemas/user.schema';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserReq } from '@/decorators/users.decorator';
import { LoginUserDto } from './dto/login-user.dto';
import { ResetPassDto } from './dto/reset-pass.dto';

@Controller('auth')
@ApiTags('权限验证')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _loginUserDto: LoginUserDto,
    @UserReq() user: MgReType<User>,
  ) {
    _loginUserDto.username;
    return this.authService.login(user);
  }

  @Post('password/reset')
  async resetPassword(@Body() resetPassDto: ResetPassDto) {
    return this.resetPassword(resetPassDto);
  }
}

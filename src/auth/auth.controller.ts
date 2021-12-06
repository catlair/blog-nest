import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MgReType } from 'src/types';
import { User } from 'src/users/schemas/user.schema';
import { LocalAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserReq } from './decorator/users.decorator';
import { LoginUserDto } from './dto/login-user.dto';

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
    return this.authService.login(user);
  }
}

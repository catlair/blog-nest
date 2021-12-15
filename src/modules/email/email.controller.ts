import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResetPassDto } from './dto/reset-pass.dto';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';

@Controller('email')
@ApiTags('邮件')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('code')
  async sendEmailCode(@Body() emailDto: SendEmailDto) {
    return this.emailService.sendEmailCode(emailDto.to);
  }

  @Post('test')
  async testEamilCode(@Body() resetPassDto: ResetPassDto) {
    return this.emailService.testEamilCode(resetPassDto);
  }
}

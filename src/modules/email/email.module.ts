import { CacheModule, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigService } from '@nestjs/config';
import { EmailController } from './email.controller';
import { Configuration } from '../../config/configuration';
import { EmailService } from './email.service';
import { CacheConfigService } from '../redis/redis.service';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Configuration>) => ({
        transport: {
          host: configService.get('email.host', { infer: true }), // 此处使用 infer: true 可以自动识别嵌套属性 email.host，避免 ts 的类型检查报错
          port: configService.get('email.port', { infer: true }),
          auth: {
            user: configService.get('email.user', { infer: true }),
            pass: configService.get('email.pass', { infer: true }),
          },
        },
        preview: false,
        defaults: {
          from: `"cat blog" <${configService.get('email.user', {
            infer: true,
          })}>`,
        },
        template: {
          dir: path.resolve(__dirname, './template'),
          adapter: new EjsAdapter(),
          options: {},
        },
      }),
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    UsersModule,
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}

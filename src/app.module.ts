import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/user/users.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { TagsModule } from './modules/tags/tags.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { configuration, Configuration } from './config/configuration';
import { BlogModule } from './modules/blog/blog.module';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService<Configuration>) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    UsersModule,
    ArticlesModule,
    TagsModule,
    CommentsModule,
    CategoriesModule,
    AuthModule,
    BlogModule,
    EmailModule,
  ],
})
export class AppModule {}

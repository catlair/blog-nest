import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ArticlesModule } from './articles/articles.module';
import { TagsModule } from './tags/tags.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { configuration, Configuration } from './config/configuration';
import { BlogModule } from './blog/blog.module';

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
  ],
})
export class AppModule {}

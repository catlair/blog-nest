import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ArticlesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 外部可以使用
})
export class UsersModule {}

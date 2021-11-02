import { Controller, Get, Query } from '@nestjs/common';
import { Cat } from 'src/schemas/cat.schema';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return await this.catsService.findAll();
  }

  @Get('create')
  create(@Query() cat): any {
    const newCat = new Cat();
    if (cat.name) {
      newCat.name = cat.name;
      newCat.age = cat.age;
      newCat.breed = cat.breed;
      return this.catsService.create(cat);
    } else {
      return {
        error: 'name is required',
      };
    }
  }
}

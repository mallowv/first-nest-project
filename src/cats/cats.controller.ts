import { Param } from '@nestjs/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import CatDto from './cat.dto';

@Controller('cats')
export class CatsController {
  cats = {
    cats: [],
  };

  @Get()
  findAllPaths(): { cats: any[] } {
    return this.cats;
  }

  @Get('breed/:breed')
  catsOfBreedPath(@Param('breed') breed): Array<{ cats: any[] }> {
    const catsOfBreed = [];
    const cats = this.cats.cats;
    cats.forEach((cat) => {
      if (cat.breed == breed) {
        catsOfBreed.push(cat);
      }
    });

    if (catsOfBreed.length != 0) return catsOfBreed;
    throw new HttpException(
      `cats of breed ${breed} don't exist in the db https://http.cat/404`,
      HttpStatus.NOT_FOUND,
    );
  }

  @Post()
  addCat(@Body() cat: CatDto): string {
    const cats = this.cats.cats;
    cats.forEach((catIter) => {
      if (catIter.name == cat.name) {
        throw new HttpException(
          `${cat.name} already exists https://http.cat/409`,
          HttpStatus.CONFLICT,
        );
      }
    });

    cats.push(cat);
    return cat.name + ' added';
  }

  @Delete()
  removeCat(@Body() cat): string {
    const cats = this.cats.cats;
    let catIdx;
    cats.every((catIter, idx) => {
      if (catIter.name == cat.name) {
        catIdx = idx;
        return false;
      }
      throw new HttpException(
        `${cat.name} does not exist in the db https://http.cat/404`,
        HttpStatus.NOT_FOUND,
      );
    });
    if (cats.length == 0) {
      throw new HttpException(
        `${cat.name} does not exist in the db https://http.cat/404`,
        HttpStatus.NOT_FOUND,
      );
    }
    this.cats.cats.splice(catIdx);
    return cat.name + ' deleted';
  }
}
